import React, { useContext } from 'react';
import {
  BankOutlined, LogoutOutlined, SearchOutlined, SettingOutlined, UserOutlined,
} from '@ant-design/icons';
import {
  Avatar, Button, Space, Switch, Typography, Dropdown,
} from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import AuthContext from 'client/core/mobx/Auth';
import { useRouter } from 'next/router';

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

  .mainappnavbar-left {
    display: flex;
    align-items: center;

    .company-select-container {
      margin-left: 2rem;
      display: flex;
      align-items: center;

      .company-name {
        margin-right: 0.5rem;
        font-size: 1.5rem;
        font-weight: 500;
      }
    }
  }
  .mainappnavbar-right {
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

    .account-avatar {
      .ant-avatar {
        &:hover, &:active {
          cursor: pointer;
        }
      }
    }
  }
`;

function MainAppNavbar() {
  const router = useRouter();

  const authCtx = useContext(AuthContext);

  const company = authCtx.myAccount?.company?.name || '...';

  const handleClickProfileMenu = ({ key }: { key: string }) => {
    if (key === 'logout') {
      authCtx.logout();
      router.push('/account/login');
    }
  };

  const profileDropdownItems = [
    {
      key: 'logout',
      label: 'Log out',
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Wrapper>
      <div className="mainappnavbar-left">
        <div>
          <Link href="/app/patients" passHref>
            <Image src="/logo-icon.png" height={30} width={30} alt="logo" />
          </Link>
        </div>
        <div className="company-select-container">
          <div className="company-name">
            {company}
          </div>
          <Space size={8}>
            <Button icon={<BankOutlined />} size="small" />
            <Link href="/app/settings/accounts">
              <Button icon={<SettingOutlined />} size="small" />
            </Link>
          </Space>
        </div>

      </div>
      <div className="mainappnavbar-right">
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
            <Dropdown
              menu={{ items: profileDropdownItems, onClick: handleClickProfileMenu }}
              trigger={['click']}
              placement="bottomRight"
              overlayStyle={{ width: '140px' }}
            >
              <Avatar size="small" icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Space>
      </div>
    </Wrapper>
  );
}

export default observer(MainAppNavbar);
