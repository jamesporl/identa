import React, { ReactNode, useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import UIContext from 'client/core/mobx/UI';
import AppLayout from '../../components/AppLayout';

type SettingsLayoutProps = {
  children: ReactNode;
};

interface WrapperProps {
  screenheight: number;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;

  .settings-menu {
    width: 220px;
    padding: 2rem;
    height: ${(props) => props.screenheight}px;
    border-right: 1px solid #dddddd;

    .head {
      text-transform: uppercase;
      font-size: 1rem;
      font-weight: 500;  
      letter-spacing: 1px;
    }
  }

  .settings-page-content {
    flex-grow: 1;
  }
`;

function SettingsLayout({ children }: SettingsLayoutProps) {
  const uiCtx = useContext(UIContext);

  return (
    <AppLayout>
      <Wrapper screenheight={uiCtx.screenheight}>
        <div className="settings-menu">
          <div className="head">Settings</div>
        </div>
        <div className="settings-page-content">
          {children}
        </div>
      </Wrapper>
    </AppLayout>
  );
}

SettingsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(SettingsLayout);
