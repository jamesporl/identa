import React, { ReactNode } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
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

SiteLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SiteLayout;
