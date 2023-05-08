import React, { ReactNode, useContext, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import MainLayout from 'client/mods/components/MainLayout';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import MainAppNavbar from './MainAppNavbar';
import SecondAppNavbar from './SecondAppNavbar';
import '@fullcalendar/common/main.css';

type AppLayoutProps = {
  children: ReactNode;
};

interface WrapperProps {
  screenheight: number;
}

const Wrapper = styled.div<WrapperProps>`
  height: ${(props) => props.screenheight}px;
  overflow: hidden;

  .page-title {
    font-weight: 700;
    font-size: 2rem;
    line-height: 1;
    color: ${(props) => props.theme.primary}
  }

  .page-content {
    background-color: #fff;

    &.with-page-header {
      height: ${(props) => props.screenheight - 160}px;
      overflow: auto;
    }

    .pad {
      margin: 1rem;
      padding: 1rem;
      background-color: #fff;
    }
  }
`;

function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const uiCtx = useContext(UIContext);

  useEffect(() => {
    if (router.pathname) {
      sheetCtx.addSheet(router.pathname);
    }
  }, [router.pathname]);

  return (
    <MainLayout>
      <Wrapper screenheight={uiCtx.screenheight}>
        <MainAppNavbar />
        <SecondAppNavbar />
        <div className="app-body">
          {children}
        </div>
      </Wrapper>
    </MainLayout>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(AppLayout);
