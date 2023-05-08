import React, { ReactNode, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import styled from 'styled-components';
import ModalContext from 'client/core/mobx/Modal';
import UIContext from 'client/core/mobx/UI';
import ModalContent from './ModalContent';

interface ModalProps {
  screenheight: number;
}

const WrappedModal = styled(Modal)<ModalProps>`
  max-height: ${(props) => props.screenheight * 0.9};

  .ant-modal-content {
    max-height: ${(props) => props.screenheight * 0.9};
    overflow-y: auto;

    ::-webkit-scrollbar {
      height: 8px;
      border: 0;
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: #fafafa;
    }
    ::-webkit-scrollbar-thumb {
      height: 6px;
      border-radius: 2px;
      background: ${(props) => props.theme.primary};
    }
  }

  .ant-modal-title {
    font-weight: 700;
    font-size: 1.2rem;
    color: ${(props) => props.theme.primary};
  }

  .ant-modal-body {
    margin-top: 2rem;
  }
`;

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  const modalCtx = useContext(ModalContext);
  const uiCtx = useContext(UIContext);

  useEffect(() => {
    const handleResize = () => {
      uiCtx.setScreenSize(window.innerWidth, window.innerHeight);
    };
    // trigger resize on mount, and listen to resize event afterwards
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return (
    <>
      {children}
      <WrappedModal
        open={modalCtx.isModalOpen}
        okText="Submit"
        onCancel={modalCtx.closeModal}
        centered
        destroyOnClose
        width={900}
        title={modalCtx.modalTitle}
        screenheight={uiCtx.screenheight}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...modalCtx.modalProps}
      >
        <ModalContent />
      </WrappedModal>
    </>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(MainLayout);
