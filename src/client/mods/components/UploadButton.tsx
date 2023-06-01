import React, { ReactNode } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

/* I just copied the styles from .ant-btn */
const Wrapper = styled.div`
  color: ${(props) => props.theme.primary};
  box-shadow: none;
  font-size: 14px;
  height: 32px;
  padding: 4px 15px;
  border-radius: 6px;
  outline: none;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.primary};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  line-height: 1.5714285714285714;

  &:hover, &:focus, &:active {
    color: #3071c7;
    border-color: #3071c7;
  }
`;

type UploadButtonProps = {
  children: ReactNode;
};

function UploadButton({ children }: UploadButtonProps) {
  return <Wrapper>{children}</Wrapper>;
}

export default observer(UploadButton);
