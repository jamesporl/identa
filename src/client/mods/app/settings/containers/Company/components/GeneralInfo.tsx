import React, { ChangeEvent, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar, Row, Col, Button, Typography, message,
} from 'antd';
import { BankOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ModalContext from 'client/core/mobx/Modal';
import { RouterOutput } from 'utils/trpc';
import sendUploadRequest from 'client/core/utils/sendUploadRequest';

type Company = RouterOutput['practiceAdmin']['company'] | undefined;

const Wrapper = styled.div`
  input {
    display: none;
  }

  .upload-image-btn {
    color: #1677ff;
    font-size: 16px;
    height: 32px;
    padding: 4px 15px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
`;

async function dataUrltoFile(dataUrl: string, filename: string, type: string) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type });
}

function GeneralInfo({ company }: { company: Company }) {
  const modalCtx = useContext(ModalContext);

  const handleSubmitCroppedImage = async (src: string, filename: string, type: string) => {
    const file = await dataUrltoFile(src, filename, type);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB');
    }
    const form = new FormData();
    form.append('file', file);
    await sendUploadRequest('/updateCompanyLogo', form);
  };

  const handleChangeImage = async (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files) {
      const file = ev.target.files[0];
      const src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
      modalCtx.openModal(
        'cropImage',
        'Update Company Logo',
        {
          src,
          onSubmit: (newSrc: string) => handleSubmitCroppedImage(newSrc, file.name, file.type),
          type: file.type,
          aspectRatio: 1,
        },
        { footer: null, width: 500 },
      );
    }
  };

  return (
    <Wrapper className="details-container">
      <div className="content">
        <div className="group">
          <div className="group-title">
            General Settings
          </div>
          <div className="group-content">
            <Row className="detail-item">
              <Col span={6} className="label">
                Info
              </Col>
              <Col span={18} className="value">
                {company?.name || ''}
              </Col>
            </Row>
            <Row className="detail-item">
              <Col span={6} className="label">
                Login Prefix
              </Col>
              <Col span={18} className="value">
                <div className="left">
                  {company?.loginPrefix || ''}
                  <div style={{ marginTop: '0.5rem' }}>
                    <Typography.Text type="secondary" style={{ fontSize: '0.75rem' }}>
                      Users that log in with a username instead of a validated email are required to
                      use this prefix, followed by a &quot;.&quot;, then by the username you
                      assigned to them. For example:
                      {` ${company?.loginPrefix || ''}.james`}
                    </Typography.Text>
                  </div>
                </div>
                <div>
                  <Button icon={<EditOutlined />} type="link" />
                </div>
              </Col>
            </Row>
            <Row className="detail-item">
              <Col span={6} className="label">
                Logo
              </Col>
              <Col span={18} className="value">
                <div>
                  <Avatar shape="square" src={company?.image} icon={<BankOutlined />} size={120} />
                </div>
                <div>
                  <label htmlFor="image" className="upload">
                    <div className="upload-image-btn"><EditOutlined /></div>
                    <input
                      id="image"
                      type="file"
                      onChange={handleChangeImage}
                      accept="image/png, image/jpeg"
                    />
                  </label>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

GeneralInfo.propTypes = {
  company: PropTypes.object, // eslint-disable-line react/require-default-props
};

export default GeneralInfo;
