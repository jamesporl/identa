import patientModals from 'client/mods/app/patients/modals';
import calendarModals from 'client/mods/app/calendar/modals';
import settingsModals from 'client/mods/app/settings/modals';

const modals = {
  ...patientModals,
  ...calendarModals,
  ...settingsModals,
};

export default modals;
