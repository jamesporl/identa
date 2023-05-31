import React from 'react';
import dynamic from 'next/dynamic';
import Spinner from 'client/mods/components/Spinner';

const CropImageComponent = dynamic(
  () => import('./CropImage'),
  {
    ssr: false,
    loading: () => <Spinner />,
  },
);

const baseModals = {
  cropImage: CropImageComponent,
};

export default baseModals;
