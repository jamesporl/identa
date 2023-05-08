/* eslint-disable operator-linebreak */
import React from 'react';
import { observer } from 'mobx-react';
// import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const CalendarContainerWrapper = styled.div`
  background-color: #fff;
  width: 100%;
`;

const CalendarWithNoSsr = dynamic(() => import('./Calendar'), {
  ssr: false,
});

function CalendarContainer() {
  return (
    <CalendarContainerWrapper>
      <CalendarWithNoSsr />
    </CalendarContainerWrapper>
  );
}

CalendarContainer.propTypes = {
  // onDateClick: PropTypes.func,
  // onDatesRender: PropTypes.func.isRequired,
  // onEventClick: PropTypes.func.isRequired,
};

CalendarContainer.defaultProps = {
  // onDateClick: () => undefined,
};

export default observer(CalendarContainer);
