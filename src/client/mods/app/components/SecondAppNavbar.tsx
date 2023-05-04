import { PlusOutlined } from '@ant-design/icons';
import { Menu, Button, Space } from 'antd';
import ModalContext from 'client/core/mobx/Modal';
import React, { useContext } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #efefef;
    background-color: #fff;
    z-index: 999;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px -2px;
    height: 40px;
    top: 0;
    padding: 0 3rem;

    .left {
      display: flex;
      align-items: center;
      width: 100%;

      .app-menu {
        flex-grow: 1;
        padding-left: 1rem;

        .ant-menu {
          line-height: 40px;
        }
      }
    }
    
`;

function SecondAppNavbar() {
  const items = [
    {
      label: 'Patients',
      key: 'patients',
    },
    {
      label: 'Calendar',
      key: 'calendar',
    },
  ];

  const modalCtx = useContext(ModalContext);

  const handleClickAddPatientBtn = () => {
    modalCtx.openModal('addPatientForm', 'Add Patient', {}, { width: 520, footer: false });
  };

  return (
    <Wrapper>
      <div className="left">
        <div className="app-menu">
          <Menu onClick={() => undefined} selectedKeys={['patients']} mode="horizontal" items={items} />
        </div>
      </div>
      <div className="right">
        <Space size={8}>
          <Button icon={<PlusOutlined />} size="small" onClick={() => undefined} type="text">
            Add Visit
          </Button>
          <Button icon={<PlusOutlined />} size="small" onClick={handleClickAddPatientBtn} type="text">
            Add Patient
          </Button>
        </Space>
      </div>
    </Wrapper>
  );
}

export default SecondAppNavbar;
