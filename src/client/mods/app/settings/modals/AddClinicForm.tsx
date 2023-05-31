import React, { useContext } from 'react';
import {
  Button, Form, Input, Space, message,
} from 'antd';
import styled from 'styled-components';
import ModalContext from 'client/core/mobx/Modal';
import trpc from 'utils/trpc';

const Wrapper = styled.div`
`;

function AddClinicForm() {
  const modalCtx = useContext(ModalContext);

  const addClinic = trpc.practiceAdmin.addClinic.useMutation({
    onError: (error) => message.error(error.message, 1),
    onSuccess: () => undefined,
  });

  const handleSubmitAddClinic = (values: { name: string }) => {
    const { name } = values;
    addClinic.mutate({ name });
    modalCtx.closeModal();
  };

  return (
    <Wrapper>
      <Form layout="vertical" onFinish={handleSubmitAddClinic}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>
        <div className="footer">
          <Space size={8}>
            <Button type="primary" ghost onClick={modalCtx.closeModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={addClinic.isLoading}>
              Submit
            </Button>
          </Space>
        </div>
      </Form>
    </Wrapper>
  );
}

export default AddClinicForm;
