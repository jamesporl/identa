import React, { useContext, useEffect } from 'react';
import {
  Avatar, Button, Input, List, Space,
} from 'antd';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import PageTitle from 'client/mods/app/components/PageTitle';
import Pagination from 'client/mods/app/components/Pagination';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import SettingsLayout from '../../components/SettingsLayout';

interface WrapperProps {
  screenheight: number;
}

const Wrapper = styled.div<WrapperProps>`
  padding-top: 2rem;
  height: ${(props) => props.screenheight - 90}px;
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

const DATA_SOURCE = [
  {
    _id: 1,
    email: 'juandelacruz@gmail.com',
    name: 'Juan dela Cruz',
    lastLoggedInAt: new Date('2023-04-25'),
    image: '/profile-placeholder.jpg',
    isActive: true,
    title: 'Owner',
  },
  {
    _id: 2,
    email: 'juandelacruz@gmail.com',
    name: 'Juan dela Cruz',
    lastLoggedInAt: new Date('2023-04-25'),
    image: '/profile-placeholder.jpg',
    isActive: true,
    title: 'Staff',
  },
  {
    _id: 3,
    email: 'juandelacruz@gmail.com',
    name: 'Juan dela Cruz',
    lastLoggedInAt: new Date('2023-04-25'),
    image: '/profile-placeholder.jpg',
    isActive: true,
    title: 'Dentist',
  },
  {
    _id: 4,
    email: 'juandelacruz@gmail.com',
    name: 'Juan dela Cruz',
    lastLoggedInAt: new Date('2023-04-25'),
    image: '/profile-placeholder.jpg',
    isActive: true,
    title: 'Dentist',
  },
  {
    _id: 5,
    email: 'juandelacruz@gmail.com',
    name: 'Juan dela Cruz',
    lastLoggedInAt: new Date('2023-04-25'),
    image: '/profile-placeholder.jpg',
    isActive: true,
    title: 'Dentist',
  },
  {
    _id: 6,
    email: 'juandelacruz@gmail.com',
    name: 'Juan dela Cruz',
    lastLoggedInAt: new Date('2023-04-25'),
    image: '/profile-placeholder.jpg',
    isActive: true,
    title: 'Staff',
  },
  {
    _id: 7,
    email: 'juandelacruz@gmail.com',
    name: 'Juan dela Cruz',
    lastLoggedInAt: new Date('2023-04-25'),
    image: '/profile-placeholder.jpg',
    isActive: true,
    title: 'Staff',
  },
  {
    _id: 8,
    email: 'juandelacruz@gmail.com',
    name: 'James dela Cruz',
    lastLoggedInAt: new Date('2023-04-25'),
    image: '/profile-placeholder.jpg',
    isActive: true,
  },
  {
    _id: 9,
    email: 'juandelacruz@gmail.com',
    name: 'Juan dela Santos',
    lastLoggedInAt: new Date('2023-04-25'),
    image: '/profile-placeholder.jpg',
    isActive: true,
    title: 'Staff',
  },

];

function AccountsList() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const uiCtx = useContext(UIContext);

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
      sheetCtx.setSheetProperty('title', 'Accounts');
      uiCtx.setSelectedMenuKey('settings');
    }
  }, [sheetCtx.sheet?.pathname, router.pathname]);

  return (
    <SettingsLayout>
      <Wrapper screenheight={uiCtx.screenheight}>
        <div className="header-container">
          <div className="content">
            <PageTitle />
            <div className="actions">
              <Button icon={<PlusOutlined />} type="primary">New Account</Button>
              <Space size={16}>
                <Space size={4}>
                  <Button icon={<FilterOutlined />}>Filter</Button>
                  <Input.Search style={{ width: '220px' }} placeholder="Last name, First name" />
                </Space>
                <Pagination />
              </Space>
            </div>
          </div>
        </div>
        <div className="list-container">
          <List
            size="large"
            className="content"
            itemLayout="horizontal"
            dataSource={DATA_SOURCE}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image} size={60} />}
                  title={item.name}
                  description={(
                    <>
                      {item.email}
                      <br />
                      Last logged in at: Feb 25, 2023 3:01 PM
                      <br />
                      {item.title}
                    </>
                    )}
                />
              </List.Item>
            )}
          />
        </div>
      </Wrapper>
    </SettingsLayout>
  );
}

export default observer(AccountsList);
