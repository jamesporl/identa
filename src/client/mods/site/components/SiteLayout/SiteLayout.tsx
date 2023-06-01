import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

type SiteLayoutProps = {
  children: ReactNode;
};

const Wrapper = styled.div`
`;

function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <Wrapper>
      <Navbar />
      <div className="site-body">
        {children}
      </div>
    </Wrapper>
  );
}

export default SiteLayout;
