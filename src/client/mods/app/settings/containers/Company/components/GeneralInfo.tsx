import React, { ChangeEvent, useContext, useState } from 'react';
import {
  Row, Col, Button, Typography, message,
} from 'antd';
import { BankOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ModalContext from 'client/core/mobx/Modal';
import trpc, { RouterOutput } from 'utils/trpc';
import sendUploadRequest, { dataUrltoFile } from 'client/core/utils/sendUploadRequest';
import ProfileAvatar from 'client/mods/components/ProfileAvatar';
import AuthContext from 'client/core/mobx/Auth';

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

function GeneralInfo({ company, refetchCompany }: {
  company: Company,
  refetchCompany: () => void }) {
  const [isLoadingLogo, setIsLoadingLogo] = useState(false);

  const trpcCtx = trpc.useContext();

  const modalCtx = useContext(ModalContext);

  const authCtx = useContext(AuthContext);

  const handleSubmitCroppedImage = async (src: string, filename: string, type: string) => {
    setIsLoadingLogo(true);
    const file = await dataUrltoFile(src, filename, type);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB');
    }
    const form = new FormData();
    form.append('file', file);
    await sendUploadRequest('/updateCompanyLogo', form);
    refetchCompany();
    const myAccount = await trpcCtx.base.myAccount.fetch();
    setTimeout(() => setIsLoadingLogo(false), 3000);
    authCtx.setMyAccount(myAccount);
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
                  <ProfileAvatar
                    shape="square"
                    src={company?.image}
                    defaultIcon={<BankOutlined />}
                    size={120}
                    isLoading={isLoadingLogo}
                  />
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

export default GeneralInfo;
