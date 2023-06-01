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

const AddClinicFormComponent = dynamic(
  () => import('./AddClinicForm'),
  {
    ssr: false,
    loading: () => <Spinner />,
  },
);

const UpdateMyAccountFormComponent = dynamic(
  () => import('./UpdateMyAccountForm'),
  {
    ssr: false,
    loading: () => <Spinner />,
  },
);

const settingsModals = {
  addAccountForm: AddAccountFormComponent,
  addClinicForm: AddClinicFormComponent,
  updateMyAccountForm: UpdateMyAccountFormComponent,
};

export default settingsModals;
