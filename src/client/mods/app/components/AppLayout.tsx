import React, { ReactNode } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import MainAppNavbar from './MainAppNavbar';
import SecondAppNavbar from './SecondAppNavbar';

type AppLayoutProps = {
  children: ReactNode;
};

const Wrapper = styled.div`
  .app-body {
    margin: 2rem 3rem;;
  }
`;

function AppLayout({ children }: AppLayoutProps) {
  return (
    <Wrapper>
      <MainAppNavbar />
      <SecondAppNavbar />
      <div className="app-body">
        {children}
      </div>
    </Wrapper>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
