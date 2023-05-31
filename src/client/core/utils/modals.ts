import baseModals from 'client/mods/app/base/modals';
import patientModals from 'client/mods/app/patients/modals';
import calendarModals from 'client/mods/app/calendar/modals';
import settingsModals from 'client/mods/app/settings/modals';

const modals = {
  ...baseModals,
  ...patientModals,
  ...calendarModals,
  ...settingsModals,
};

export default modals;
