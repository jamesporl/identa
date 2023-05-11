import React from 'react';
import dynamic from 'next/dynamic';
import Spinner from 'client/mods/components/Spinner';

const AddVisitsFormComponent = dynamic(
  () => import('./AddVisitsForm'),
  {
    ssr: false,
    loading: () => <Spinner />,
  },
);

const calendarModals = {
  addVisitsForm: AddVisitsFormComponent,
};

export default calendarModals;
