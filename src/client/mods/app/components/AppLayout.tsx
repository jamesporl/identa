import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
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

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
