import React, { useEffect } from 'react';
import flatpickr from 'flatpickr';

const DatePicker = ({ onDateChange }) => {
  useEffect(() => {
    flatpickr("#dateFilter", {
      dateFormat: "Y/m/d",
      defaultDate: new Date(),
      minDate: new Date(),
      altInput: true,
      altFormat: "Y/m/d (D)",
      altInputClass: 'calendar-input',
      locale: {
        firstDayOfWeek: 0,
        weekdays: {
          shorthand: ['日', '月', '火', '水', '木', '金', '土'],
          longhand: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
        }
      },
      disableMobile: true,
      onChange: function(selectedDates, dateStr) {
        onDateChange(dateStr);
      }
    });
  }, [onDateChange]);

  return (
    <div className="input-wrapper">
      <input type="text" id="dateFilter" />
      <img src="/flag-waving-guide-registration-form/calendar_icon.png" alt="Open Calendar" id="calendarIcon" className="calendar-icon" />
    </div>
  );
};

export default DatePicker;
