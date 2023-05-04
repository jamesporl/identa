import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import { RoleKey } from 'server/mods/base/db/_types';
import AuthContext from 'client/core/mobx/Auth';

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #efefef;
  background-color: #fff;
  z-index: 1000;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  height: 60px;
  top: 0;
  padding: 0 3rem;
`;

function Navbar() {
  const authCtx = useContext(AuthContext);

  let accountBtn = (
    <Link href="/account/login" passHref>
      <Button type="primary" ghost>Login</Button>
    </Link>
  );

  if (authCtx.myAccount?.roleKey === RoleKey.user) {
    accountBtn = (
      <Link href="/app" passHref>
        <Button type="primary" ghost>Go to App</Button>
      </Link>
    );
  } else if (authCtx.myAccount?.roleKey === RoleKey.admin) {
    accountBtn = (
      <Link href="/site-admin" passHref>
        <Button type="primary" ghost>Admin Site</Button>
      </Link>
    );
  }

  return (
    <Wrapper>
      <div className="left">
        <Link href="/" passHref>
          <Image src="/logo-full.png" height={30} width={129} alt="logo" />
        </Link>
      </div>
      <div className="right">
        {accountBtn}
      </div>
    </Wrapper>
  );
}

export default observer(Navbar);
