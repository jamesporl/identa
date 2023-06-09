import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { List, Button, Typography } from 'antd';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import PageTitle from 'client/mods/app/components/PageTitle';
import trpc from 'utils/trpc';
import { PlusOutlined, SolutionOutlined } from '@ant-design/icons';
import ModalContext from 'client/core/mobx/Modal';
import SettingsLayout from '../../components/SettingsLayout';
import GeneralInfo from './components/GeneralInfo';

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

    .detail-item {
      &:first-child > .label {
        border-top: 1px solid ${(props) => props.theme.dark1};
        border-top-left-radius: 1rem;
      }

      &:first-child > .value {
        border-top: 1px solid ${(props) => props.theme.dark1};
        border-top-right-radius: 1rem;
      }

      &:last-child > .label {
        border-bottom-left-radius: 1rem;
      }

      &:last-child > .value {
        border-bottom-right-radius: 1rem;
      }

      .label {
        font-weight: 700;
        padding: 1.5rem 1rem;
        background-color: ${(props) => props.theme.light1};
        display: flex;
        align-items: center;
        border-bottom: 1px solid ${(props) => props.theme.dark1};
        border-left: 1px solid ${(props) => props.theme.dark1};
        border-right: 1px solid ${(props) => props.theme.dark1};
      }

      .value {
        padding: 1.5rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid ${(props) => props.theme.dark1};
        border-right: 1px solid ${(props) => props.theme.dark1};

        .left {
          margin-right: 2rem;
        }
      }
    }
  }

  
`;

function Company() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const uiCtx = useContext(UIContext);

  const modalCtx = useContext(ModalContext);

  const company = trpc.practiceAdmin.company.useQuery();

  const clinics = trpc.practiceAdmin.clinics.useQuery({ page: 1, pageSize: 20 });

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
        <GeneralInfo company={company.data} refetchCompany={company.refetch} />
        <div className="details-container">
          <div className="content">
            <div className="group">
              <div className="group-title">
                Clinics
              </div>
              <div style={{ marginTop: '1rem' }}>
                <Typography.Text type="secondary" style={{ marginTop: '2rem' }}>
                  If you operate in multiple locations, simply add a clinic to represent each
                  location.
                </Typography.Text>
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
                      <List.Item.Meta title={(
                        <>
                          <SolutionOutlined />
                          {` ${item.name}`}
                        </>
                    )}
                      />
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
