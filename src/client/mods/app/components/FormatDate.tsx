import React from 'react';
import dayJs from 'dayjs';
import PropTypes from 'prop-types';

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

FormatDate.propTypes = {
  dateStr: PropTypes.string,
  format: PropTypes.string,
};

FormatDate.defaultProps = {
  dateStr: '',
  format: 'date',
};

export default FormatDate;
