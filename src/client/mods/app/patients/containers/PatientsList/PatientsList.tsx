import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AppLayout from 'client/mods/app/components/AppLayout';
import PageHeader from 'client/mods/app/components/PageHeader';
import SheetContext from 'client/core/mobx/Sheet';
import WrappedTable from 'client/mods/components/WrappedTable';
import trpc from 'utils/trpc';
import FormatDate from 'client/mods/app/components/FormatDate';
import { BirthSex } from 'server/mods/practice/db/_types';

const Wrapper = styled.div`
  
`;

function PatientsList() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
      sheetCtx.setSheetProperty('title', 'Patients');
    }
  }, [sheetCtx.sheet?.pathname, router.pathname]);

  const patients = trpc.practice.patients.useQuery({ page: 1, pageSize: 20 });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
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
        <PageHeader />
        <WrappedTable columns={columns} size="small" dataSource={patients.data?.nodes || []} pagination={false} rowKey="_id" />
      </AppLayout>
    </Wrapper>
  );
}

export default observer(PatientsList);
