import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import AuthContext from 'client/core/mobx/Auth';

const Wrapper = styled.div`
  :before {
    display: block;
    content: '';
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  .spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

function AppRedirect() {
  const authCtx = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (!authCtx.isLoadingMyAccount && authCtx.myAccount) {
      if (authCtx.myAccount.email && !authCtx.myAccount.company) {
        router.push('/app/company/first-company');
      } else {
        router.push('/app/patients');
      }
    }
  }, [authCtx.myAccount, authCtx.isLoadingMyAccount]);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <Wrapper>
      <div className="spinner-container">
        <Spin indicator={antIcon} tip="Redirecting..." />
      </div>
    </Wrapper>
  );
}

export default observer(AppRedirect);
