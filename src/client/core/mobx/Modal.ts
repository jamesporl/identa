import { Attributes, ReactNode, createContext } from 'react';
import { observable, action, makeObservable } from 'mobx';

interface ModalProps extends Attributes {
  width?: number;
  footer?: ReactNode;
  onOk?: () => void;
}

class Modal {
  constructor() {
    makeObservable(this);
  }

  @observable isModalOpen = false;

  @observable modalContext: unknown = {};

  @observable modalKey = 'addPatientForm';

  @observable modalProps: ModalProps = {};

  @observable modalTitle = '';

  @action openModal = (
    modalKey: string,
    modalTitle: string,
    modalContext: unknown = {},
    modalProps: ModalProps = {},
  ) => {
    this.modalTitle = modalTitle;
    this.modalKey = modalKey;
    this.modalContext = modalContext;
    this.modalProps = modalProps;
    this.isModalOpen = true;
  };

  @action closeModal = (modalContext?: unknown) => {
    this.isModalOpen = false;
    this.modalContext = modalContext || {};
  };
}

const ModalContext = createContext<Modal>(new Modal());

export default ModalContext;
