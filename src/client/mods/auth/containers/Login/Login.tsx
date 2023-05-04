import React, { useContext } from 'react';
import {
  Button, Form, Input, message, Typography,
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getPageTitle from 'client/core/utils/getPageTitle';
import trpc from 'utils/trpc';
import AuthContext from 'client/core/mobx/Auth';
import AuthLayout from '../../components/AuthLayout';
import { RoleKey } from '../../../../../server/mods/base/db/_types';

function Login() {
  const [loginForm] = Form.useForm();

  const authCtx = useContext(AuthContext);

  const router = useRouter();

  const trpcCtx = trpc.useContext();

  const login = trpc.base.login.useMutation({
    onError: (error) => message.error(error.message, 0.5),
    onSuccess: async (result) => {
      if (result.authToken) {
        authCtx.login(result.authToken);
        const myAccount = await trpcCtx.base.myAccount.fetch();
        authCtx.setMyAccount(myAccount);
        if (myAccount.roleKey === RoleKey.admin) {
          router.push('/admin/accounts');
        } else {
          router.push('/app');
        }
      }
    },
  });

  const handleSubmitLogin = (values: { login: string, password: string }) => {
    login.mutate({ login: values.login, password: values.password });
  };

  return (
    <AuthLayout>
      <Head>
        <title>{getPageTitle('Log In')}</title>
      </Head>
      <Form form={loginForm} onFinish={handleSubmitLogin}>
        <Form.Item name="login" rules={[{ required: true, message: 'Email address or username is required' }]}>
          <Input placeholder="Email or username" disabled={login.isLoading} />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Password is required' }]}>
          <Input.Password placeholder="Password" disabled={login.isLoading} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block htmlType="submit" loading={login.isLoading}>Log in</Button>
        </Form.Item>
      </Form>
      <div>
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
