import React, { ReactNode, useContext, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import MainLayout from 'client/mods/components/MainLayout';
import SheetContext from 'client/core/mobx/Sheet';
import MainAppNavbar from './MainAppNavbar';
import SecondAppNavbar from './SecondAppNavbar';

type AppLayoutProps = {
  children: ReactNode;
};

const Wrapper = styled.div`
  
`;

function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  useEffect(() => {
    if (router.pathname) {
      sheetCtx.addSheet(router.pathname);
    }
  }, [router.pathname]);

  return (
    <MainLayout>
      <Wrapper>
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

export default AppLayout;
