import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ModalContext from 'client/core/mobx/Modal';
import modals from 'client/core/utils/modals';

const Wrapper = styled.div`
  .not-found {
    margin: 40px 0;
    text-align: center;
  }
`;

function ModalContent() {
  const modalCtx = useContext(ModalContext);
  const modalComponent = modals[modalCtx.modalKey as keyof typeof modals];

  if (!modalComponent) {
    return (
      <Wrapper>
        <div className="not-found">
          <h3>Content not found.</h3>
        </div>
      </Wrapper>
    );
  }

  const modalContent = React.createElement(modalComponent, modalCtx.modalProps);

  return <Wrapper>{modalContent}</Wrapper>;
}

export default observer(ModalContent);
