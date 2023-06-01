import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AppLayout from 'client/mods/app/components/AppLayout';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import trpc from 'utils/trpc';
import { Button, Descriptions, Space } from 'antd';
import Image from 'next/image';
import FormatDate from 'client/mods/app/components/FormatDate';
import Pagination from 'client/mods/app/components/Pagination';
import PageTitle from 'client/mods/app/components/PageTitle';
import Breadcrumbs from 'client/mods/app/components/Breadcrumbs';
import { EditOutlined } from '@ant-design/icons';

const Wrapper = styled.div`
  padding: 1rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  
  .main-info {
    margin-top: 2rem;
    display: flex;

    .main-info-right {
      margin-left: 1rem;
    }
  }
`;

function PatientView() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const uiCtx = useContext(UIContext);

  const { patientId = '' } = router.query as { patientId?: string };

  const patient = trpc.practicePatients.patient.useQuery({ patientId }, { enabled: !!patientId });

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
      uiCtx.setSelectedMenuKey('patients');
    }
  }, [sheetCtx.sheet?.pathname, router.pathname]);

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname && patient.data) {
      sheetCtx.setSheetProperty('title', patient.data.name);
    }
  }, [sheetCtx.sheet?.pathname, router.pathname, patient.data]);

  const mainInfo = (
    <div className="main-info">
      <div className="photo">
        <Image
          src="/profile-placeholder.jpg"
          alt="patient-photo"
          height={180}
          width={180}
        />
      </div>
      <div className="main-info-right">
        <div className="desc">
          <Descriptions column={2}>
            <Descriptions.Item label="Birth sex">M</Descriptions.Item>
            <Descriptions.Item label="Date of birth">
              <FormatDate dateStr="1988-06-20" format="date" />
            </Descriptions.Item>
            <Descriptions.Item label="Phone">09154324212</Descriptions.Item>
            <Descriptions.Item label="Age">34</Descriptions.Item>
            <Descriptions.Item label="E-mail address">gonzales@gmail.com</Descriptions.Item>
            <Descriptions.Item label="Address">
              32 Carino St., Brgy. Maginhawa
              <br />
              Queon City 1200
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <Wrapper>
        <div className="header">
          <div className="left">
            <Breadcrumbs />
            <Space size={16}>
              <PageTitle />
              <Button icon={<EditOutlined />}>Update</Button>
            </Space>
          </div>
          <Pagination />
        </div>
        {mainInfo}
      </Wrapper>
    </AppLayout>
  );
}

export default observer(PatientView);
