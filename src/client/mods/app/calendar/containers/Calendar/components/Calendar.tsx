/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
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

function Calendar() {
  // const fullCalendarRef = useRef();

  const uiCtx = useContext(UIContext);

  const handleChangeDates = (ev) => {
    console.log(ev);
  };

  const handleClickEvent = (ev) => {
    console.log(ev);
  };

  const events = [
    {
      title: 'event1',
      start: '2023-05-11T04:00:00',
      end: '2023-05-11T06:00:00',
    },
    {
      title: 'event2',
      start: '2023-05-17T16:00:00',
      end: '2023-05-17T19:00:00',
    },
    {
      title: 'event2',
      start: '2023-05-22T11:00:00',
      end: '2023-05-22T13:00:00',
    },
  ];

  return (
    <FullCalendarWrapper>
      <FullCalendar
        initialView="dayGridMonth"
        plugins={[dayGridPlugin, interactionPlugin, momentTimezone, timeGridPlugin]}
        datesSet={handleChangeDates}
        events={events}
        eventClick={handleClickEvent}
        handleWindowResize={false}
        headerToolbar={{
          left: 'title',
          right: 'prev,next dayGridMonth,timeGridWeek today',
        }}
        height={uiCtx.screenheight - 90}
        views={{
          timeGridDay: {
            allDaySlot: true,
          },
          timeGridWeek: {
            allDaySlot: false,
          },
        }}
      />
    </FullCalendarWrapper>
  );
}

export default observer(Calendar);
