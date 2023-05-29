import React, { useContext } from 'react';
import {
  Button, Form, Input, DatePicker, Space, message, Row, Col, TimePicker,
} from 'antd';
import styled from 'styled-components';
import dayjs, { type Dayjs } from 'dayjs';
import ModalContext from 'client/core/mobx/Modal';
import trpc from 'utils/trpc';
import SelectValue from 'client/core/utils/_types/SelectValue';
import PatientSelector from '../../patients/components/PatientSelector';
import PractitionerSelector from '../../settings/components/PractitionerSelector';

const Wrapper = styled.div`
  .footer {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
`;

function AddVisitsForm() {
  const modalCtx = useContext(ModalContext);

  const addVisit = trpc.practiceVisits.addVisits.useMutation({
    onError: (error) => message.error(error.message, 0.5),
    onSuccess: () => undefined,
  });

  const handleSubmitAddVisits = (values: {
    patient: SelectValue,
    account: SelectValue,
    reason?: string,
    date: Dayjs,
    startTime: Dayjs,
    endTime: Dayjs,
  }) => {
    const {
      patient, account, reason, date, startTime, endTime,
    } = values;
    const dateStr = date.format('YYYY-MM-DD');
    const startTimeStr = startTime.format('HH:mm:00');
    const endTimeStr = endTime.format('HH:mm:00');
    const startAt = dayjs(`${dateStr}T${startTimeStr}`).utc().format();
    const endAt = dayjs(`${dateStr}T${endTimeStr}`).utc().format();
    addVisit.mutate({
      patientId: patient.value,
      accountId: account.value,
      reason,
      startAt,
      endAt,
    });
    modalCtx.closeModal();
  };

  return (
    <Wrapper>
      <Form layout="vertical" onFinish={handleSubmitAddVisits}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="patient"
              label="Patient"
              rules={[{ required: true, message: 'Patient is required' }]}
            >
              <PatientSelector />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="account"
              label="Practitioner"
              rules={[{ required: true, message: 'Practitioner is required' }]}
            >
              <PractitionerSelector />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Date is required' }]}
            >
              <DatePicker format="MM-DD-YYYY" style={{ width: '100%' }} placeholder="MM-DD-YYYY" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="From"
              name="startTime"
              rules={[{ required: true, message: 'Start time is required' }]}
            >
              <TimePicker
                format="h:mm A"
                style={{ width: '100%' }}
                minuteStep={15}
                placeholder="ex. 1:00 PM"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="To"
              name="endTime"
              rules={[{ required: true, message: 'End time is required' }]}
            >
              <TimePicker
                format="h:mm A"
                style={{ width: '100%' }}
                minuteStep={15}
                placeholder="ex. 3:00 PM"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="reason"
              label="Reason"
            >
              <Input.TextArea placeholder="Cleaning, root canal" rows={2} />
            </Form.Item>
          </Col>
        </Row>
        <div className="footer">
          <Space size={8}>
            <Button type="primary" ghost onClick={modalCtx.closeModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={addVisit.isLoading}>
              Submit
            </Button>
          </Space>
        </div>
      </Form>
    </Wrapper>
  );
}

export default AddVisitsForm;
