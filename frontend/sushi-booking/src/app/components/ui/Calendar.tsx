"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { ImArrowLeft, ImArrowRight } from "react-icons/im";


const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDate = startOfMonth.startOf("week"); // bắt đầu từ chủ nhật
  const endDate = endOfMonth.endOf("week");

  const today = dayjs();

  const generateCalendar = () => {
    let date = startDate.clone();
    const calendar = [];

    while (date.isBefore(endDate, "day")) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(date.clone());
        date = date.add(1, "day");
      }
      calendar.push(week);
    }

    return calendar;
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, "month"));
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 rounded"
        >
          <ImArrowLeft/>
        </button>
        <h2 className="text-lg font-bold">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 rounded"
        >
          <ImArrowRight/>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-700">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2 text-center">
        {generateCalendar().map((week, weekIdx) =>
          week.map((day, dayIdx) => {
            const isCurrentMonth = day.month() === currentDate.month();
            const isToday = day.isSame(today, "day");

            return (
              <div
                key={`${weekIdx}-${dayIdx}`}
                className={`p-2 rounded text-sm ${
                  isToday
                    ? "text-black font-bold border"
                    : isCurrentMonth
                    ? "text-gray-800"
                    : "text-gray-400"
                }`}
              >
                {day.date()}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Calendar;
