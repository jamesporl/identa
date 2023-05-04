import React, { useContext } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import {
  Button, Typography, Form, Input, message,
} from 'antd';
import { useRouter } from 'next/router';
import trpc from 'utils/trpc';
import { RoleKey } from 'server/mods/base/db/_types';
import AuthContext from 'client/core/mobx/Auth';

const Wrapper = styled.div`
  :before {
    display: block;
    content: '';
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  .form-container {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
    margin: 0 2rem;

    .logo {
      text-align: center;
      margin-bottom: 2rem;
    }

    .submit-btn-container {
      margin-top: 1rem;
      margin-left: auto;
      margin-right: auto;
      width: 120px;
    }
  }
`;

function FirstCompany() {
  const authCtx = useContext(AuthContext);

  const router = useRouter();

  const [firstCompanyForm] = Form.useForm();

  const trpcCtx = trpc.useContext();

  const switchAccountContext = trpc.base.switchAccountContext.useMutation({
    onError: (error) => message.error(error.message, 0.5),
    onSuccess: async (authToken) => {
      if (authToken) {
        authCtx.login(authToken);
        const myAccount = await trpcCtx.base.myAccount.fetch();
        authCtx.setMyAccount(myAccount);
        router.push('/app');
      }
    },
  });

  const addCompanyByUser = trpc.base.addCompanyByUser.useMutation({
    onError: (error) => message.error(error.message, 0.5),
    onSuccess: async (result) => {
      switchAccountContext.mutate({ roleKey: RoleKey.user, companyId: result._id });
    },
  });

  const handleSubmitAddCompany = (values: { name: string }) => {
    addCompanyByUser.mutate({ name: values.name });
  };

  return (
    <Wrapper>
      <div className="form-container">
        <div className="logo">
          <Image src="/logo-full.png" alt="logo" height={40} width={172} />
        </div>
        <Typography.Title level={4}>
          Tell us the name of your company
        </Typography.Title>
        <Form form={firstCompanyForm} onFinish={handleSubmitAddCompany}>
          <Form.Item name="name" rules={[{ required: true, message: 'Company name is required' }]}>
            <Input placeholder="Best Dental Care Company" size="large" />
          </Form.Item>
          <Typography.Text type="secondary">
            This name can be edited later. You will be redirected to the app next.
          </Typography.Text>
          <Form.Item className="submit-btn-container">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              disabled={addCompanyByUser.isLoading || switchAccountContext.isLoading}
            >
              Submit

            </Button>
          </Form.Item>
        </Form>

      </div>
    </Wrapper>
  );
}

export default FirstCompany;
