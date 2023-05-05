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

type AppLayoutProps = {
  children: ReactNode;
};

interface WrapperProps {
  screenheight: number;
}

const Wrapper = styled.div<WrapperProps>`
  height: ${(props) => props.screenheight}px;
  overflow: hidden;

  .page-content {
    background-color: #f7f8f8;

    &.with-page-header {
      height: ${(props) => props.screenheight - 150}px;
      overflow: auto;
    }

    .pad {
      padding: 1rem;
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
