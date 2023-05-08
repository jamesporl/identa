/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezone from '@fullcalendar/moment-timezone';
import timeGridPlugin from '@fullcalendar/timegrid';
import UIContext from 'client/core/mobx/UI';

const FullCalendarWrapper = styled.div`
  .fc .fc-toolbar.fc-header-toolbar {
    margin: 0.5rem 1rem;
  }
  .fc .fc-button {
    font-size: 1rem;
    line-height: 1.5715;
    height: 32px;
    padding: 2.4px 15px;
    border-radius: 2px;
    color: ${({ theme: { primary } }) => primary};
    background-color: #fff;
    border-color: ${({ theme: { primary } }) => primary};
  }

  .fc .fc-button:hover {
    color: #fff;
    background-color: ${({ theme: { primary } }) => primary};
  }

  .fc .fc-button:disabled {
    color: rgba(0, 0, 0, 0.6);
    background-color: #fff;
    border-color: rgba(0, 0, 0, 0.6);
  }

  h2.fc-toolbar-title {
    font-size: 1.2rem;
    font-weight: 500;
  }

  .fc .fc-col-header-cell-cushion {
    cursor: text;
  }

  .fc .fc-col-header-cell-cushion:hover {
    color: #009394;
  }
`;

function Calendar({ onDateClick = () => undefined }) {
  // const fullCalendarRef = useRef();

  const uiCtx = useContext(UIContext);

  // TODO: pull profile from account
  const timezone = 'Asia/Manila';

  // useEffect(() => {
  //   const resizeTimeout = setTimeout(() => {
  //     if (fullCalendarRef.current) {
  //       // eslint-disable-next-line no-underscore-dangle
  //       fullCalendarRef.current._calendarApi?.updateSize();
  //     }
  //   }, 2000);
  //   return () => {
  //     clearTimeout(resizeTimeout);
  //   };
  // }, [uiCtx.screenwidth]);

  return (
    <FullCalendarWrapper>
      <FullCalendar
        initialView="dayGridMonth"
        plugins={[dayGridPlugin, interactionPlugin, momentTimezone, timeGridPlugin]}
        dateClick={onDateClick}
        // datesSet={onDatesRender}
        events={[]}
        // eventClick={onEventClick}
        handleWindowResize={false}
        headerToolbar={{
          left: 'title',
          right: 'prev,next today',
        }}
        height={uiCtx.screenheight - 224}
        slotEventOverlap={false}
        timeZone={timezone}
        views={{
          timeGridDay: {
            allDaySlot: true,
          },
          timeGridWeek: {
            allDaySlot: false,
          },
        }}
        buttonText={{
          today: 'today', month: 'month', week: 'week', day: 'day', list: 'list',
        }}
      />
    </FullCalendarWrapper>
  );
}

Calendar.propTypes = {
  onDateClick: PropTypes.func,
};

Calendar.defaultProps = {
  onDateClick: () => undefined,
};

export default observer(Calendar);
