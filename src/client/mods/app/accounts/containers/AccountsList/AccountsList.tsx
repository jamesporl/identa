import React from 'react';
import styled from 'styled-components';
import AppLayout from 'client/mods/app/components/AppLayout';
import { Typography } from 'antd';

const Wrapper = styled.div`
  
`;

function AccountsList() {
  return (
    <Wrapper>
      <AppLayout>
        <Typography.Title level={3}>Accounts</Typography.Title>
      </AppLayout>
    </Wrapper>
  );
}

export default AccountsList;
