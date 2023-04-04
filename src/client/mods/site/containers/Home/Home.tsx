import React from 'react';
import styled from 'styled-components';
import SiteLayout from 'client/mods/site/components/SiteLayout/SiteLayout';
import { Button, Typography } from 'antd';

const Wrapper = styled.div`
  .hero-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 16rem 1rem;
    background: rgb(219,219,228);
    background: linear-gradient(90deg, rgba(219,219,228,1) 0%, rgba(253,253,255,1) 53%, rgba(20,127,222,1) 100%);

    .hero-title {
      font-weight: 700;
      font-size: 3rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-top: 2rem;
    }

    .hero-cta {
      margin-top: 2rem;

      .ant-btn {
        font-size: 1.5rem;
        height: 64px;
        padding: 0 32px;
      }
    }
  }
`;

function Home() {
  return (
    <SiteLayout>
      <Wrapper>
        <div className="hero-container">
          <div className="hero-title">
            Dental Practice Just Got Better
          </div>
          <div className="hero-subtitle">
            Get organized with a feature-rich, easy-to-use practice management software
          </div>
          <div className="hero-cta">
            <Button type="primary" ghost>Try IDENTA Now</Button>
          </div>
        </div>
      </Wrapper>
    </SiteLayout>
  );
}

export default Home;
