import React from 'react';
import {
  Button, Form, Input, message, Typography,
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getPageTitle from 'client/core/utils/getPageTitle';
import trpc from 'utils/trpc';
import { VER_TOKEN_KEY } from 'client/core/utils/storageKeys';
import AuthLayout from '../../components/AuthLayout';

function Signup() {
  const [signupForm] = Form.useForm();

  const router = useRouter();

  const signup = trpc.base.signup.useMutation({
    onError: (error) => message.error(error.message, 0.5),
    onSuccess: async (result) => {
      sessionStorage.setItem(VER_TOKEN_KEY, result.verificationToken);
      router.push('/account/verify-email');
    },
  });

  const handleSubmitSignup = (values: {
    email: string,
    password: string,
  }) => {
    signup.mutate({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <AuthLayout>
      <Head>
        <title>{getPageTitle('Sign Up')}</title>
      </Head>
      <Form form={signupForm} onFinish={handleSubmitSignup}>
        <Form.Item name="email" rules={[{ required: true, message: 'Email address is required' }]}>
          <Input placeholder="Email" disabled={signup.isLoading} />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Password is required' }]}>
          <Input.Password placeholder="Password" disabled={signup.isLoading} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block htmlType="submit" loading={signup.isLoading}>
            Sign up
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text type="secondary">
        {'By continuing, you agree to our '}
        <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
          Terms and Conditions.
        </a>
      </Typography.Text>
      <div style={{ marginTop: '1.5rem', fontStyle: 'italic', color: '#0D2175' }}>
        <Typography.Text type="secondary">
          {'Already have an account? '}
          <Link href="/account/login" as="/account/login">
            Log in here.
          </Link>
        </Typography.Text>
      </div>
    </AuthLayout>
  );
}

export default Signup;
