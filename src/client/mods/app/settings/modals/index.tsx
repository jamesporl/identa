import React from 'react';
import dynamic from 'next/dynamic';
import Spinner from 'client/mods/components/Spinner';

const AddAccountFormComponent = dynamic(
  () => import('./AddAccountForm'),
  {
    ssr: false,
    loading: () => <Spinner />,
  },
);

const settingsModals = {
  addAccountForm: AddAccountFormComponent,
};

export default settingsModals;
