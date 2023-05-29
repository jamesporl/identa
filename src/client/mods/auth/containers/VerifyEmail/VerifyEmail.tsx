import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  Button, Form, Input, message, Typography,
} from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import getPageTitle from 'client/core/utils/getPageTitle';
import { VER_TOKEN_KEY } from 'client/core/utils/storageKeys';
import trpc from 'utils/trpc';
import AuthContext from 'client/core/mobx/Auth';
import AuthLayout from '../../components/AuthLayout';

function VerifyEmail() {
  const [verToken, setVerToken] = useState('');

  const [verForm] = Form.useForm();

  const authCtx = useContext(AuthContext);

  const router = useRouter();

  const trpcCtx = trpc.useContext();

  useEffect(() => {
    const storedVerToken = sessionStorage.getItem(VER_TOKEN_KEY);
    if (storedVerToken) {
      setVerToken(storedVerToken);
    } else {
      router.push('/account/login');
    }
  }, []);

  const verifyEmailByCode = trpc.base.verifyEmailByCode.useMutation({
    onError: (error) => message.error(error.message, 0.5),
    onSuccess: async (result) => {
      if (result.authToken) {
        authCtx.login(result.authToken);
        const myAccount = await trpcCtx.base.myAccount.fetch();
        authCtx.setMyAccount(myAccount);
        if (myAccount.isAdmin) {
          router.push('/admin/accounts');
        } else {
          router.push('/app');
        }
      }
    },
  });

  const handleSubmitVerify = useCallback((values: { code: string }) => {
    verifyEmailByCode.mutate({ verToken, code: values.code });
  }, [verToken]);

  return (
    <AuthLayout>
      <Head>
        <title>{getPageTitle('Verify Email')}</title>
      </Head>
      <Typography.Text type="secondary">
        A verification code has been sent to your email. Please enter the code below to start
        enjoying the features of this app.
      </Typography.Text>
      <Form form={verForm} onFinish={handleSubmitVerify} style={{ marginTop: '2rem' }}>
        <Form.Item name="code" rules={[{ required: true, message: 'Verification code is required' }]}>
          <Input placeholder="Verification Code" disabled={verifyEmailByCode.isLoading} maxLength={6} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block htmlType="submit" loading={verifyEmailByCode.isLoading}>Submit</Button>
        </Form.Item>
      </Form>
      <div className="resend">
        <Typography.Text type="secondary">
          {'If in case you did not get an email with the code or the code has expired, '}
          <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
            click here to resend the code
          </a>
        </Typography.Text>
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
