import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

type AuthLayoutProps = {
  children: ReactNode;
};

const Wrapper = styled.div`
  :before {
    display: block;
    content: '';
    position: relative;
    top: 0;
    left: 0;
    background: rgb(26, 111, 191);
    background: linear-gradient(
      56deg,
      rgba(26, 111, 191, 1) 34%,
      rgba(76, 147, 214, 1) 68%,
      rgba(49, 130, 206, 1) 100%
    );
    width: 100vw;
    height: 100vh;
  }

  .auth-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px;
    border-radius: 7.5px;
    background-color: #fff;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    width: 400px;
    padding: 3rem 2rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background: #fff;
  }

  .logo-container {
    display: flex;
    justify-content: center;
  }

  .form-container {
    margin-top: 2rem;
  }
`;

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Wrapper>
      <div className="auth-container">
        <div className="logo-container">
          <Link href="/" as="/" passHref>
            <Image src="/logo-full.png" alt="logo" height={60} width={258} />
          </Link>
        </div>
        <div className="form-container">
          {children}
        </div>
      </div>
    </Wrapper>
  );
}

export default AuthLayout;
