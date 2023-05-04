import React, { useContext } from 'react';
import {
  Button, Form, Input, Radio, DatePicker, Space, message,
} from 'antd';
import { type Dayjs } from 'dayjs';
import styled from 'styled-components';
import ModalContext from 'client/core/mobx/Modal';
import trpc from 'utils/trpc';
import { BirthSex } from 'server/mods/practice/db/_types';

const Wrapper = styled.div`
  .footer {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
`;

const birthSexOptions = [
  { value: BirthSex.m, label: 'Male' },
  { value: BirthSex.f, label: 'Female' },
  { value: BirthSex.u, label: 'Unknown' },
];

function AddPatientForm() {
  const modalCtx = useContext(ModalContext);

  const addPatient = trpc.practice.addPatientToClinicByStaff.useMutation({
    onError: (error) => message.error(error.message, 0.5),
    onSuccess: () => undefined,
  });

  const handleSubmitAddPatient = (values: {
    lastName: string,
    firstName: string,
    birthSex: BirthSex,
    dob: Dayjs,
  }) => {
    const {
      lastName, firstName, birthSex, dob: iDob,
    } = values;
    const dob = iDob.format('YYYY-MM-DD');
    addPatient.mutate({
      lastName, firstName, birthSex, dob,
    });
    modalCtx.closeModal();
  };

  return (
    <Wrapper>
      <Form layout="vertical" onFinish={handleSubmitAddPatient}>
        <Form.Item
          name="lastName"
          label="Last name"
          rules={[{ required: true, message: 'Last name is required' }]}
        >
          <Input placeholder="Dela Cruz" autoFocus />
        </Form.Item>
        <Form.Item
          name="firstName"
          label="First name"
          rules={[{ required: true, message: 'First name is required' }]}
        >
          <Input placeholder="Juan" />
        </Form.Item>
        <Form.Item
          name="birthSex"
          label="Birth sex"
          rules={[{ required: true, message: 'Birth sex is required' }]}
        >
          <Radio.Group options={birthSexOptions} />
        </Form.Item>
        <Form.Item
          name="dob"
          label="Birth date"
          rules={[{ required: true, message: 'Birth date is required' }]}
        >
          <DatePicker format="MM-DD-YYYY" style={{ width: '100%' }} placeholder="MM-DD-YYYY" />
        </Form.Item>
        <div className="footer">
          <Space size={8}>
            <Button type="primary" ghost onClick={modalCtx.closeModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </div>
      </Form>
    </Wrapper>
  );
}

export default AddPatientForm;
