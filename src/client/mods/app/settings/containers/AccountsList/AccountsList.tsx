import React, { useContext, useEffect, useState } from 'react';
import {
  Avatar, Button, Input, List, Space, Tag,
} from 'antd';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import PageTitle from 'client/mods/app/components/PageTitle';
import Pagination from 'client/mods/app/components/Pagination';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import ModalContext from 'client/core/mobx/Modal';
import trpc from 'utils/trpc';
import LIST_LIMIT from 'client/core/utils/constants/LIST_LIMIT';
import SettingsLayout from '../../components/SettingsLayout';
import computeAccountName, { Account } from './utils/computeAccountName';

interface WrapperProps {
  screenheight: number;
}

const Wrapper = styled.div<WrapperProps>`
  padding-top: 2rem;
  height: ${(props) => props.screenheight - 50}px;
  overflow: hidden;
  
  .header-container {
    display: flex;
    justify-content: center;

    .content {
      width: 100%;
      max-width: 800px;

      .actions {
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;

        .right {
          display: flex;
        }
      }
    }
  }

  .list-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    height: ${(props) => props.screenheight - 234}px;
    overflow: auto;

    .content {
      width: 100%;
      max-width: 800px;
    }
  }
`;

function AccountsList() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const uiCtx = useContext(UIContext);

  const modalCtx = useContext(ModalContext);

  const [page, setPage] = useState(sheetCtx.sheet?.page || 1);

  const accounts = trpc.practice.accounts.useQuery({ page, pageSize: LIST_LIMIT });

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
      sheetCtx.setSheetProperty('title', 'Accounts');
      uiCtx.setSelectedMenuKey('settings');
    }
  }, [sheetCtx.sheet?.pathname, router.pathname]);

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname && accounts.data) {
      sheetCtx.setSheetProperty('totalCount', accounts.data.totalCount);
      const activeDocLinks = accounts.data.nodes.map((account) => ({
        _id: account._id,
        href: `/app/settings/${account._id}`,
      }));
      sheetCtx.setSheetProperty('activeDocLinks', activeDocLinks);
    }
  }, [sheetCtx.sheet?.pathname, router.pathname, accounts.data]);

  const handleClickAddAccountBtn = () => {
    modalCtx.openModal('addAccountForm', 'Add Account', {}, { width: 700, footer: false });
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const renderItem = (item: Account) => {
    let practionerTag = null;
    if (item.isPractitioner) {
      practionerTag = <Tag color="#108ee9">Practioner</Tag>;
    }
    return (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src="/profile-placeholder.jpg" size={60} />}
          title={computeAccountName(item)}
          description={(
            <>
              {item.login}
              <br />
              Last logged in at: Feb 25, 2023 3:01 PM
              <br />
              {`${item.title || ''} ` }
              {practionerTag}
            </>
            )}
        />
      </List.Item>
    );
  };

  return (
    <SettingsLayout>
      <Wrapper screenheight={uiCtx.screenheight}>
        <div className="header-container">
          <div className="content">
            <PageTitle />
            <div className="actions">
              <Button icon={<PlusOutlined />} type="primary" onClick={handleClickAddAccountBtn}>
                New Account
              </Button>
              <Space size={16}>
                <Space size={4}>
                  <Button icon={<FilterOutlined />}>Filter</Button>
                  <Input.Search style={{ width: '220px' }} placeholder="Last name, First name" />
                </Space>
                <Pagination onChangePage={handleChangePage} />
              </Space>
            </div>
          </div>
        </div>
        <div className="list-container">
          <List
            size="large"
            className="content"
            itemLayout="horizontal"
            dataSource={accounts.data?.nodes || []}
            renderItem={renderItem}
          />
        </div>
      </Wrapper>
    </SettingsLayout>
  );
}

export default observer(AccountsList);
