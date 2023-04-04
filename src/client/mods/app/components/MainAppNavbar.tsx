import React from 'react';
import {
  BankOutlined, SearchOutlined, SettingOutlined, UserOutlined,
} from '@ant-design/icons';
import {
  Avatar, Button, Select, Space, Switch, Typography,
} from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  background-color: #fff;
  z-index: 1000;
  height: 50px;
  top: 0;
  padding: 0 3rem;

  .left {
    display: flex;
    align-items: center;

    .company-select-container {
      margin-left: 2rem;

      .company-select {
        margin-left: 1rem;
      }
    }
    .company-settings-container {
      margin-left: 0.5rem;
    }
  }
  .right {
    display: flex;
    align-items: center;

    .kiosk-switch-container {
      margin-right: 4rem;
      display: flex;
      align-items: center;

      .kiosk-switch {
        margin-left: 0.5rem;
      }
    }
  }
`;

function MainAppNavbar() {
  return (
    <Wrapper>
      <div className="left">
        <div>
          <Link href="/" passHref>
            <Image src="/logo-icon.png" height={30} width={30} alt="logo" />
          </Link>
        </div>
        <div className="company-select-container">
          <Select
            defaultValue="lucy"
            style={{ width: 240 }}
            onChange={() => undefined}
            className="company-select"
            suffixIcon={<BankOutlined />}
            size="small"
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'My Company Dental Care, Inc.' },
              { value: 'Yiminghe', label: 'yiminghe' },
              { value: 'disabled', label: 'Disabled', disabled: true },
            ]}
          />
        </div>
        <div className="company-settings-container">
          <Button icon={<SettingOutlined />} size="small" type="text" />
        </div>
      </div>
      <div className="right">
        <div className="kiosk-switch-container">
          <Typography.Text type="secondary">Kiosk Mode</Typography.Text>
          <div className="kiosk-switch">
            <Switch size="small" />
          </div>
        </div>
        <Space direction="horizontal" size={16}>
          <div className="search-button">
            <Button icon={<SearchOutlined />} size="small" onClick={() => undefined} type="text" />
          </div>
          <div className="account-avatar">
            <Avatar size="small" icon={<UserOutlined />} />
          </div>
        </Space>
      </div>
    </Wrapper>
  );
}

export default MainAppNavbar;
