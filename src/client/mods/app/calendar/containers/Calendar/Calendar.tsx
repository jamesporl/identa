import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AppLayout from 'client/mods/app/components/AppLayout';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import CalendarContainer from './components/CalendarContainer';

const Wrapper = styled.div`
  .main-info {
    display: flex;

    .main-info-right {
      margin-left: 1rem;
    }
  }
`;

function Calendar() {
  const router = useRouter();

  const sheetCtx = useContext(SheetContext);

  const uiCtx = useContext(UIContext);

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
      sheetCtx.setSheetProperty('title', 'Calendar');
      uiCtx.setSelectedMenuKey('calendar');
    }
  }, [sheetCtx.sheet?.pathname, router.pathname]);

  return (
    <AppLayout>
      <Wrapper>
        <CalendarContainer />
      </Wrapper>
    </AppLayout>
  );
}

export default observer(Calendar);
