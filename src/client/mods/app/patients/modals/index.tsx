import React from 'react';
import dynamic from 'next/dynamic';
import Spinner from 'client/mods/components/Spinner';

const AddPatientFormComponent = dynamic(
  () => import('./AddPatientForm'),
  {
    ssr: false,
    loading: () => <Spinner />,
  },
);

const patientModals = {
  addPatientForm: AddPatientFormComponent,
};

export default patientModals;
