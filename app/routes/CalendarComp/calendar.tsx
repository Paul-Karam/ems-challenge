import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { useState, useEffect } from "react";
import '@schedule-x/theme-default/dist/index.css';

function CalendarApp({ timesheets }) {
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const events = timesheets.map((timesheet) => ({
    id: timesheet.id.toString(),
    title: `Timesheet #${timesheet.id} - ${timesheet.full_name}`,
    start: timesheet.start_time.slice(0, 16).replace('T', ' '),
    end: timesheet.end_time.slice(0, 16).replace('T', ' '),
  }));

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: events,
    plugins: [eventsService],
  });

  useEffect(() => {
    eventsService.getAll();
  }, [eventsService]);

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarApp;
