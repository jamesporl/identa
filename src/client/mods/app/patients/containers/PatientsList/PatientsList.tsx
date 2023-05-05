import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AppLayout from 'client/mods/app/components/AppLayout';
import PageHeader from 'client/mods/app/components/PageHeader';
import SheetContext from 'client/core/mobx/Sheet';
import WrappedTable from 'client/mods/components/WrappedTable';
import trpc from 'utils/trpc';
import FormatDate from 'client/mods/app/components/FormatDate';
import { BirthSex } from 'server/mods/practice/db/_types';
import LIST_LIMIT from 'client/core/utils/constants/LIST_LIMIT';

const Wrapper = styled.div`
  
`;

function PatientsList() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const [page, setPage] = useState(sheetCtx.sheet?.page || 1);

  const patients = trpc.practice.patients.useQuery({ page, pageSize: LIST_LIMIT });

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
      sheetCtx.setSheetProperty('title', 'Patients');
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

  const handleChangePage = async (newPage: number) => {
    setPage(newPage);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (name: string, doc: any) => <Link href={`/app/patients/${doc._id}`}>{name}</Link>,
    },
    {
      title: 'Birth Sex',
      dataIndex: 'birthSex',
      key: 'birthSex',
      width: '5%',
      render: (birthSex: BirthSex) => birthSex.toUpperCase(),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '5%',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      width: '20%',
      render: (dob: string) => <FormatDate dateStr={dob} />,
    },
  ];

  return (
    <Wrapper>
      <AppLayout>
        <PageHeader pagination={{ onChange: handleChangePage }} />
        <div className="page-content with-page-header">
          <WrappedTable
            columns={columns}
            size="small"
            dataSource={patients.data?.nodes || []}
            pagination={false}
            rowKey="_id"
          />
        </div>
      </AppLayout>
    </Wrapper>
  );
}

export default observer(PatientsList);
