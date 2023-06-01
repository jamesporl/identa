import React, { ReactNode } from 'react';
import SecondAppNavbar from './SecondAppNavbar';
import '@fullcalendar/common/main.css';
import AppSingleHeaderLayout from './AppSingleHeaderLayout';

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppSingleHeaderLayout>
      <SecondAppNavbar />
      {children}
    </AppSingleHeaderLayout>
  );
}

export default AppLayout;
