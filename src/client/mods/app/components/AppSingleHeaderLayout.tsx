import React, { ReactNode, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import MainLayout from 'client/mods/components/MainLayout';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import MainAppNavbar from './MainAppNavbar';
import '@fullcalendar/common/main.css';

type AppSingleHeaderLayoutProps = {
  children: ReactNode;
};

interface WrapperProps {
  screenheight: number;
}

const Wrapper = styled.div<WrapperProps>`
  height: ${(props) => props.screenheight}px;
  overflow: hidden;
`;

function AppSingleHeaderLayout({ children }: AppSingleHeaderLayoutProps) {
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
        {children}
      </Wrapper>
    </MainLayout>
  );
}

export default observer(AppSingleHeaderLayout);
