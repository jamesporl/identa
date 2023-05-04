import React, { useEffect } from 'react';
import {
  Col, Row, Button, Form, Input, message, Typography,
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

  useEffect(() => {
    console.log('Loaded - Signup');
  }, []);

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
    firstName: string,
    lastName: string,
  }) => {
    signup.mutate({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    });
  };

  return (
    <AuthLayout>
      <Head>
        <title>{getPageTitle('Sign Up')}</title>
      </Head>
      <Form form={signupForm} onFinish={handleSubmitSignup}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item name="firstName" rules={[{ required: true, message: 'First name is required' }]}>
              <Input placeholder="First name" disabled={signup.isLoading} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lastName" rules={[{ required: true, message: 'Last name is required' }]}>
              <Input placeholder="Last name" disabled={signup.isLoading} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="email" rules={[{ required: true, message: 'Email address is required' }]}>
          <Input placeholder="Email" disabled={signup.isLoading} />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Password is required' }]}>
          <Input.Password placeholder="Password" disabled={signup.isLoading} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block htmlType="submit" loading={signup.isLoading}>Sign up</Button>
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
            {'Already have an account? '}
            <Link href="/account/login" as="/account/login">
              Log in here.
            </Link>
          </Typography.Text>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Signup;
