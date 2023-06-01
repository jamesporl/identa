import React from 'react';
import dayJs from 'dayjs';

interface FormatDateProps {
  dateStr?: string;
  format: 'date' | 'dateTime';
}

function FormatDate({ format, dateStr }: FormatDateProps) {
  let formattedDate = '';
  if (dateStr) {
    if (format === 'date') {
      formattedDate = dayJs(dateStr).format('MMM D, YYYY');
    }
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formattedDate}</>;
}

FormatDate.defaultProps = {
  dateStr: '',
};

export default FormatDate;
