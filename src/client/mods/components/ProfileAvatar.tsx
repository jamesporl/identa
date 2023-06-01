import React, { ReactNode } from 'react';
import { observer } from 'mobx-react';
import { Avatar } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

type ProfileAvatarProps = {
  src?: string;
  isLoading?: boolean;
  shape?: 'circle' | 'square';
  defaultIcon: ReactNode;
  size: number;
};

function ProfileAvatar({
  src, size, isLoading, shape, defaultIcon,
}: ProfileAvatarProps) {
  if (isLoading) {
    return <Avatar icon={<LoadingOutlined spin />} shape={shape} size={size} />;
  }
  if (!src) {
    return <Avatar icon={defaultIcon} shape={shape} size={size} />;
  }
  return <Avatar src={src} shape={shape} size={size} />;
}

ProfileAvatar.defaultProps = {
  src: '',
  isLoading: false,
  shape: 'round',
};

export default observer(ProfileAvatar);
