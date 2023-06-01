import React, { useContext } from 'react';
import {
  Button, Form, Input, Space, message,
} from 'antd';
import styled from 'styled-components';
import ModalContext from 'client/core/mobx/Modal';
import trpc from 'utils/trpc';
import { MyAccountOutput } from 'client/core/mobx/Auth';

const Wrapper = styled.div`
`;

function UpdateMyAccountForm() {
  const modalCtx = useContext(ModalContext);

  const { account, onSubmit } = modalCtx.modalContext as {
    account: MyAccountOutput,
    onSubmit: () => void,
  };

  const updateMyAccount = trpc.base.updateMyAccount.useMutation({
    onError: (error) => message.error(error.message, 1),
    onSuccess: () => undefined,
  });

  const handleSubmitUpdateMyAccount = (values: {
    name: string,
    title?: string,
    phone?: string,
  }) => {
    const { name, title, phone } = values;
    updateMyAccount.mutate({ name, title, phone });
    modalCtx.closeModal();
    onSubmit();
  };

  return (
    <Wrapper>
      <Form layout="vertical" onFinish={handleSubmitUpdateMyAccount} initialValues={account}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="ex. James Lacson, MD" autoFocus />
        </Form.Item>
        <Form.Item name="title" label="Title">
          <Input placeholder="ex. Orthodentist" />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <div className="footer">
          <Space size={8}>
            <Button type="primary" ghost onClick={modalCtx.closeModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={updateMyAccount.isLoading}>
              Submit
            </Button>
          </Space>
        </div>
      </Form>
    </Wrapper>
  );
}

export default UpdateMyAccountForm;
