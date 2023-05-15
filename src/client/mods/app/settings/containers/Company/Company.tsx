import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { List, Button } from 'antd';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import PageTitle from 'client/mods/app/components/PageTitle';
import trpc from 'utils/trpc';
import { PlusOutlined } from '@ant-design/icons';
import ModalContext from 'client/core/mobx/Modal';
import SettingsLayout from '../../components/SettingsLayout';

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
    }
  }

  .details-container {
    display: flex;
    justify-content: center;

    .content {
      width: 100%;
      max-width: 800px;
    }
  }

  .group {
    margin-top: 2rem;

    .group-title {
      font-weight: 700;
      font-size: 18px;
      text-transform: uppercase;
      color: ${(props) => props.theme.primary};
    }

    .group-actions {
      margin-top: 2rem;
    }

    .group-content {
      margin-top: 2rem;
    }
  }

  
`;

function Company() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const uiCtx = useContext(UIContext);

  const modalCtx = useContext(ModalContext);

  const company = trpc.practice.company.useQuery();

  const clinics = trpc.practice.clinics.useQuery({ page: 1, pageSize: 20 });

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
    }
  }, [sheetCtx.sheet?.pathname, router.pathname]);

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname && company.data) {
      sheetCtx.setSheetProperty('title', company.data.name);
    }
  }, [sheetCtx.sheet?.pathname, router.pathname, company.data]);

  const handleClickAddClinic = () => {
    modalCtx.openModal('addClinicForm', 'Add Clinic', {}, { width: 500, footer: false });
  };

  return (
    <SettingsLayout>
      <Wrapper screenheight={uiCtx.screenheight}>
        <div className="header-container">
          <div className="content">
            <PageTitle />
          </div>
        </div>
        <div className="details-container">
          <div className="content">
            <div className="group">
              <div className="group-title">
                Clinics
              </div>
              <div className="group-actions">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleClickAddClinic}
                >
                  New Clinic
                </Button>
              </div>
              <div className="group-content">
                <List
                  size="large"
                  className="content"
                  itemLayout="horizontal"
                  bordered
                  dataSource={clinics.data?.nodes || []}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta title={item.name} />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </SettingsLayout>
  );
}

export default observer(Company);
