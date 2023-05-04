import React from 'react';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 200px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function Spinner() {
  return (
    <Wrapper>
      <Spin indicator={loadingIcon} />
    </Wrapper>
  );
}
