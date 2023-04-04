import { ContainerOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Select, Menu, Button, Space,
} from 'antd';
import React from 'react';
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

      .clinic-select-container {
        padding-right: 2rem;
        border-right: 1px solid #ccc;
      }

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

  return (
    <Wrapper>
      <div className="left">
        <div className="clinic-select-container">
          <Select
            defaultValue="lucy"
            style={{ width: 200 }}
            onChange={() => undefined}
            className="company-select"
            suffixIcon={<ContainerOutlined />}
            size="small"
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'Makati Branch' },
              { value: 'Yiminghe', label: 'yiminghe' },
              { value: 'disabled', label: 'Disabled', disabled: true },
            ]}
          />
        </div>
        <div className="app-menu">
          <Menu onClick={() => undefined} selectedKeys={['patients']} mode="horizontal" items={items} />
        </div>
      </div>
      <div className="right">
        <Space size={8}>
          <Button icon={<PlusOutlined />} size="small" onClick={() => undefined} type="text">
            Add Visit
          </Button>
          <Button icon={<PlusOutlined />} size="small" onClick={() => undefined} type="text">
            Add Patient
          </Button>
        </Space>

      </div>
    </Wrapper>
  );
}

export default SecondAppNavbar;
