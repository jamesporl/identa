import React, { ReactNode, useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import UIContext from 'client/core/mobx/UI';
import { Menu } from 'antd';
import Link from 'next/link';
import AppSingleHeaderLayout from '../../components/AppSingleHeaderLayout';

type SettingsLayoutProps = {
  children: ReactNode;
};

interface WrapperProps {
  screenheight: number;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;

  .settings-title {
    color: ${(props) => props.theme.primary};
    font-size: 1rem;
    font-weight: bold;
    margin-top: 2rem;
    text-transform: uppercase;
  }

  .settings-page-content {
    flex-grow: 1;
  }
`;

function SettingsLayout({ children }: SettingsLayoutProps) {
  const uiCtx = useContext(UIContext);

  const items = [
    {
      key: 'settings',
      type: 'group',
      label: <div className="settings-title">Settings</div>,
    },
    {
      key: 'accounts',
      label: <Link href="/app/settings/accounts">Accounts</Link>,
    },
    {
      key: 'company',
      label: <Link href="/app/settings/company">Company</Link>,
    },
  ];
  return (
    <AppSingleHeaderLayout>
      <Wrapper screenheight={uiCtx.screenheight}>
        <Menu
          style={{ width: 256 }}
          defaultSelectedKeys={['accounts']}
          defaultOpenKeys={['accounts']}
          mode="inline"
          items={items}
        />
        <div className="settings-page-content">
          {children}
        </div>
      </Wrapper>
    </AppSingleHeaderLayout>
  );
}

SettingsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(SettingsLayout);
