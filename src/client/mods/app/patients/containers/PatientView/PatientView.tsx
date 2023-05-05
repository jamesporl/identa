import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AppLayout from 'client/mods/app/components/AppLayout';
import PageHeader from 'client/mods/app/components/PageHeader';
import SheetContext from 'client/core/mobx/Sheet';
import trpc from 'utils/trpc';
import { Descriptions, Typography } from 'antd';
import Image from 'next/image';
import FormatDate from 'client/mods/app/components/FormatDate';

const Wrapper = styled.div`
  .main-info {
    display: flex;

    .main-info-right {
      margin-left: 1rem;
    }
  }
`;

function PatientView() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const { patientId = '' } = router.query as { patientId?: string };

  const patient = trpc.practice.patient.useQuery({ patientId }, { enabled: !!patientId });

  const { name } = patient.data || {};

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
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
        <div className="name">
          <Typography.Title level={3}>{name}</Typography.Title>
        </div>
        <div className="desc">
          <Descriptions column={2}>
            <Descriptions.Item label="Birth sex">M</Descriptions.Item>
            <Descriptions.Item label="Date of birth"><FormatDate dateStr="1988-06-20" /></Descriptions.Item>
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
      <PageHeader />
      <div className="page-content with-page-header">
        <div className="pad">
          <Wrapper>
            {mainInfo}
          </Wrapper>
        </div>
      </div>
    </AppLayout>
  );
}

export default observer(PatientView);
