import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import SheetContext from 'client/core/mobx/Sheet';
import { LoadingOutlined } from '@ant-design/icons';

const Wrapper = styled.span`
  font-weight: 700;
  font-size: 2rem;
  line-height: 1;
  color: ${(props) => props.theme.primary}
`;

function PageTitle() {
  const sheetCtx = useContext(SheetContext);

  if (sheetCtx.sheet?.title) {
    return <Wrapper>{sheetCtx.sheet.title}</Wrapper>;
  }

  return <Wrapper><LoadingOutlined spin /></Wrapper>;
}

export default observer(PageTitle);
