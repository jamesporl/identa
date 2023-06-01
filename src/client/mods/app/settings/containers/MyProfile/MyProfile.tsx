import React, {
  ChangeEvent, useContext, useEffect, useState,
} from 'react';
import styled from 'styled-components';
import { message, Button, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import SheetContext from 'client/core/mobx/Sheet';
import UIContext from 'client/core/mobx/UI';
import AppSingleHeaderLayout from 'client/mods/app/components/AppSingleHeaderLayout';
import PageTitle from 'client/mods/app/components/PageTitle';
import AuthContext from 'client/core/mobx/Auth';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import UploadButton from 'client/mods/components/UploadButton';
import ProfileAvatar from 'client/mods/components/ProfileAvatar';
import ModalContext from 'client/core/mobx/Modal';
import sendUploadRequest, { dataUrltoFile } from 'client/core/utils/sendUploadRequest';
import trpc from 'utils/trpc';

interface WrapperProps {
  screenheight: number;
}

const Wrapper = styled.div<WrapperProps>`
  padding-top: 2rem;
  height: ${(props) => props.screenheight - 50}px;
  overflow: hidden;

  .header-container {
    display: flex;
    justify-content: center;

    .content {
      width: 100%;
      max-width: 800px;
    }
  }

  .details-container {
    display: flex;
    justify-content: center;

    .content {
      width: 100%;
      max-width: 800px;
    }
  }

  .main-details-container {
    margin-top: 2rem;
    display: flex;

    .photo {
      width: 200px;
      text-align: center;
    }

    .name-container {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
    }
  }
`;

function MyProfile() {
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const router = useRouter();

  const uiCtx = useContext(UIContext);

  const authCtx = useContext(AuthContext);

  const sheetCtx = useContext(SheetContext);

  const modalCtx = useContext(ModalContext);

  const trpcCtx = trpc.useContext();

  useEffect(() => {
    if (sheetCtx.sheet?.pathname === router.pathname) {
      sheetCtx.setSheetProperty('asPath', router.asPath);
      sheetCtx.setSheetProperty('title', 'My Profile');
    }
  }, [sheetCtx.sheet?.pathname, router.pathname]);

  const handleClickUpdateAccount = () => {
    modalCtx.openModal(
      'updateMyAccountForm',
      'Update Account',
      {
        account: authCtx.myAccount,
        onSubmit: async () => {
          const myAccount = await trpcCtx.base.myAccount.fetch();
          authCtx.setMyAccount(myAccount);
        },
      },
      { footer: false, width: 400 },
    );
  };

  const handleSubmitCroppedImage = async (src: string, filename: string, type: string) => {
    setIsLoadingImage(true);
    const file = await dataUrltoFile(src, filename, type);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB');
    }
    const form = new FormData();
    form.append('file', file);
    await sendUploadRequest('/updateMyCompanyAccountImage', form);
    const myAccount = await trpcCtx.base.myAccount.fetch();
    setTimeout(() => setIsLoadingImage(false), 3000);
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
        'Update Profile Photo',
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
    <AppSingleHeaderLayout>
      <Wrapper screenheight={uiCtx.screenheight}>
        <div className="header-container">
          <div className="content">
            <PageTitle />
          </div>
        </div>
        <div className="details-container">
          <div className="content">
            <div className="main-details-container">
              <div className="photo">
                <ProfileAvatar
                  shape="circle"
                  src={authCtx.myAccount?.image || ''}
                  size={120}
                  defaultIcon={<UserOutlined />}
                  isLoading={isLoadingImage}
                />
                <div style={{ marginTop: '1rem' }}>
                  <label htmlFor="image">
                    <UploadButton>Upload Photo</UploadButton>
                    <input
                      id="image"
                      type="file"
                      onChange={handleChangeImage}
                      accept="image/png, image/jpeg"
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              <div className="name-container">
                <div>
                  <Typography.Title level={3}>{authCtx.myAccount?.name || ''}</Typography.Title>
                  <Typography.Paragraph>{authCtx.myAccount?.login || ''}</Typography.Paragraph>
                  <Typography.Paragraph>
                    {authCtx.myAccount?.title || 'No title'}
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    {authCtx.myAccount?.phone || 'No phone'}
                  </Typography.Paragraph>
                </div>
                <div>
                  <Button type="primary" ghost icon={<EditOutlined />} onClick={handleClickUpdateAccount} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </AppSingleHeaderLayout>
  );
}

export default observer(MyProfile);
