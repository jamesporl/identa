import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AppLayout from 'client/mods/app/components/AppLayout';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import trpc from 'utils/trpc';
import FormatDate from 'client/mods/app/components/FormatDate';
import LIST_LIMIT from 'client/core/utils/constants/LIST_LIMIT';
import {
  Avatar, Button, Input, List,
} from 'antd';
import PageTitle from 'client/mods/app/components/PageTitle';
import Pagination from 'client/mods/app/components/Pagination';
import { FilterOutlined } from '@ant-design/icons';

interface WrapperProps {
  screenheight: number;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;

  .left {
    width: 350px;
    border-right: 1px solid #ddd;
    padding: 2rem 1rem;
    height: ${(props) => props.screenheight - 90}px;
    overflow: hidden;

    .filter-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
    }

    .search-container {
      margin-top: 1.5rem;
    }

    .visits-container {
      margin-top: 2rem;

      .visits-title {
        font-size: 1rem;
        font-weight: 700;
        color: ${(props) => props.theme.primary}
      }
    }
  }

  .right {
    flex-grow: 1;
    width: 100%;
    height: ${(props) => props.screenheight - 90}px;
    overflow: auto;
  }
`;

function PatientsList() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const uiCtx = useContext(UIContext);

  const [page, setPage] = useState(sheetCtx.sheet?.page || 1);

  const patients = trpc.practicePatients.patients.useQuery({ page, pageSize: LIST_LIMIT });

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
      sheetCtx.setSheetProperty('title', 'Patients');
      uiCtx.setSelectedMenuKey('patients');
    }
  }, [sheetCtx.sheet?.pathname, router.pathname]);

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname && patients.data) {
      sheetCtx.setSheetProperty('totalCount', patients.data.totalCount);
      const activeDocLinks = patients.data.nodes.map((pt) => ({
        _id: pt._id,
        href: `/app/patients/${pt._id}`,
      }));
      sheetCtx.setSheetProperty('activeDocLinks', activeDocLinks);
    }
  }, [sheetCtx.sheet?.pathname, router.pathname, patients.data]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <AppLayout>
      <Wrapper screenheight={uiCtx.screenheight}>
        <div className="left">
          <div className="page-title-container">
            <PageTitle />
          </div>
          <div className="search-container">
            <Input.Search placeholder="Last name, first name" />
          </div>
          <div className="filter-container">
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Pagination onChangePage={handleChangePage} />
          </div>
          <div className="visits-container">
            <div className="visits-title">
              Upcoming Visits
            </div>
          </div>
        </div>
        <div className="right">
          <List
            size="large"
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={patients.data?.nodes || []}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={(
                    <Link href={`/app/patients/${item._id}`}>
                      <Avatar src="/profile-placeholder.jpg" size={60} />
                    </Link>
                  )}
                  title={<Link href={`/app/patients/${item._id}`}>{item.name}</Link>}
                  description={(
                    <>
                      {`${item.birthSex.toUpperCase()} | `}
                      <FormatDate dateStr={item.dob} format="date" />
                      {` | ${item.age}`}
                    </>
                    )}
                />
              </List.Item>
            )}
          />
        </div>
      </Wrapper>
    </AppLayout>
  );
}

export default observer(PatientsList);
