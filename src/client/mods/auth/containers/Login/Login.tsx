import React from 'react';
import {
  Button, Form, Input, message, Typography,
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getPageTitle from 'client/core/utils/getPageTitle';
import useStores from 'client/core/mobx/useStores';
import trpc from 'utils/trpc';
import AuthLayout from '../../components/AuthLayout';
import { RoleKey } from '../../../../../server/mods/base/db/_types';

function Login() {
  const [loginForm] = Form.useForm();

  const { authStore } = useStores();

  const router = useRouter();

  const trpcCtx = trpc.useContext();

  const login = trpc.base.login.useMutation({
    onError: (error) => message.error(error.message, 0.5),
    onSuccess: async (authToken) => {
      authStore.login(authToken);
      const myAccount = await trpcCtx.base.myAccount.fetch();
      authStore.setMyAccount(myAccount);
      if (myAccount.roleKey === RoleKey.admin) {
        router.push('/admin/accounts');
      } else {
        router.push('/app/dashboard');
      }
    },
  });

  const handleSubmitLogin = (values: { login: string, password: string }) => {
    login.mutate({ login: values.login, password: values.password });
  };

  return (
    <AuthLayout>
      <Head>
        <title>{getPageTitle('Login')}</title>
      </Head>
      <Form form={loginForm} onFinish={handleSubmitLogin}>
        <Form.Item name="login" rules={[{ required: true, message: 'Email address or username is required' }]}>
          <Input placeholder="Email or username" disabled={login.isLoading} />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Password is required' }]}>
          <Input.Password placeholder="Password" disabled={login.isLoading} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block htmlType="submit" loading={login.isLoading}>Login</Button>
        </Form.Item>
      </Form>
      <div className="terms">
        <Typography.Text type="secondary">
          {'By continuing, you agree to our '}
          <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
            Terms and Conditions.
          </a>
        </Typography.Text>
        <div style={{ marginTop: '1.5rem', fontStyle: 'italic', color: '#0D2175' }}>
          <Typography.Text type="secondary">
            {'Don\'t have an account? '}
            <Link href="/account/signup" as="/account/signup">
              Sign up here.
            </Link>
          </Typography.Text>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
