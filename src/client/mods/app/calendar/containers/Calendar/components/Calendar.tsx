/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezone from '@fullcalendar/moment-timezone';
import timeGridPlugin from '@fullcalendar/timegrid';
import UIContext from 'client/core/mobx/UI';
import LIST_LIMIT from 'client/core/utils/constants/LIST_LIMIT';
import trpc from 'utils/trpc';
import dayjs from 'dayjs';

const FullCalendarWrapper = styled.div`
  .fc .fc-toolbar.fc-header-toolbar {
    margin: 0.5rem 1rem;
  }
  .fc .fc-button {
    font-size: 1rem;
    line-height: 1.5715;
    height: 32px;
    padding: 2.4px 15px;
    border-radius: 8px;
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

  .fc .fc-button-primary:not(:disabled).fc-button-active {
    background-color: ${({ theme: { primary } }) => primary};
  }

  h2.fc-toolbar-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme: { primary } }) => primary};
  }

  .fc .fc-col-header-cell-cushion {
    cursor: text;
  }

  .fc .fc-col-header-cell-cushion:hover {
    color: #009394;
  }
`;

function Calendar() {
  const [viewDates, setViewDates] = useState<{ startAt: Date, endAt: Date } | null>(null);

  const uiCtx = useContext(UIContext);

  const visits = trpc.practice.visits.useQuery({
    page: 1,
    pageSize: LIST_LIMIT,
    startAt: dayjs(viewDates?.startAt).utc().format(),
    endAt: dayjs(viewDates?.endAt).utc().format(),
  }, { enabled: !!viewDates });

  const handleChangeDates = ({ start, end }: { start: Date, end: Date }) => {
    setViewDates({ startAt: start, endAt: end });
  };

  const handleClickEvent = () => {

  };

  const events = (visits.data?.nodes || []).map((ev) => ({
    title: ev.patient.name,
    start: ev.startAt,
    end: ev.endAt,
  }));

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
