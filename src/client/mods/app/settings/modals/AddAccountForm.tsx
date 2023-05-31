import React, { useContext } from 'react';
import {
  Button, Form, Input, Row, Col, Space, message, Switch,
} from 'antd';
import styled from 'styled-components';
import ModalContext from 'client/core/mobx/Modal';
import trpc from 'utils/trpc';

const Wrapper = styled.div`
`;

function AddAccountForm() {
  const modalCtx = useContext(ModalContext);

  const addAccount = trpc.practiceAdmin.addAccount.useMutation({
    onError: (error) => message.error(error.message, 1),
    onSuccess: () => undefined,
  });

  const handleSubmitAddAccount = (values: {
    name: string,
    login: string,
    password: string,
    isPractitioner?: boolean,
  }) => {
    const {
      name,
      login,
      password,
      isPractitioner = false,
    } = values;
    addAccount.mutate({
      name, login, password, isPractitioner,
    });
    modalCtx.closeModal();
  };

  return (
    <Wrapper>
      <Form layout="vertical" onFinish={handleSubmitAddAccount}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="lastName"
              label="Last name"
              rules={[{ required: true, message: 'Last name is required' }]}
            >
              <Input placeholder="Dela Cruz" autoFocus />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="firstName"
              label="First name"
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input placeholder="Juan" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="nameSuffix"
              label="Name suffix"
            >
              <Input placeholder="Jr., Sr., I" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="professionalSuffix"
              label="Prof. suffix"
            >
              <Input placeholder="MD, PhD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="login"
              label="Email"
              rules={[{ required: true, message: 'Email is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Job title"
            >
              <Input placeholder="Staff, Dentist, Accountant" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="isPractitioner"
              label="Practitioner?"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <div className="footer">
          <Space size={8}>
            <Button type="primary" ghost onClick={modalCtx.closeModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={addAccount.isLoading}>
              Submit
            </Button>
          </Space>
        </div>
      </Form>
    </Wrapper>
  );
}

export default AddAccountForm;
