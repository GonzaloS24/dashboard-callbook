import { useState, useEffect, useRef, useCallback } from "react";
import "cally";
import "../../styles/DateRangeFilter.scss";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";

const DateRangeFilter = ({ onDateChange, dateRange }) => {
  const [localDateRange, setLocalDateRange] = useState(dateRange);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);
  const containerRef = useRef(null);

  const formatISODate = (date) => new Date(date).toISOString().split("T")[0];

  const getCurrentDate = () => formatISODate(new Date());

  const createRangeValue = useCallback(
    (startDate, endDate) =>
      `${formatISODate(startDate)}/${formatISODate(endDate)}`,
    []
  );

  const parseRangeValue = (rangeValue) => {
    const [start, end] = rangeValue.split("/");
    return { startDate: start, endDate: end };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCalendarOpen) {
      const calendar = document.querySelector("#calendar-range");
      if (!calendar) return;

      calendarRef.current = calendar;
      calendar.setAttribute(
        "value",
        createRangeValue(dateRange.startDate, dateRange.endDate)
      );

      const handleChange = () => {
        const newRange = parseRangeValue(calendar.value);

        const endDate = new Date(newRange.endDate);
        const currentDate = new Date();

        if (endDate > currentDate) {
          newRange.endDate = formatISODate(currentDate);
        }

        setLocalDateRange(newRange);
        onDateChange(newRange);
        setIsCalendarOpen(false);
      };

      calendar.addEventListener("change", handleChange);
      return () => calendar.removeEventListener("change", handleChange);
    }
  }, [dateRange, onDateChange, isCalendarOpen, createRangeValue]);

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return (
    <div className="date-range-filter" ref={containerRef}>
      <div className="date-range-filter__input" onClick={toggleCalendar}>
        <i className="bx bxs-calendar date-range-filter__calendar-icon"></i>
        {`${localDateRange.startDate} - ${localDateRange.endDate}`}
      </div>

      {isCalendarOpen && (
        <div className="date-range-filter__calendar-popup">
          <calendar-range
            id="calendar-range"
            show-range="false"
            locale="es"
            months={1}
            max={getCurrentDate()}
          >
            <span slot="previous">
              <MdArrowBackIosNew />
            </span>
            <span slot="next">
              <MdArrowForwardIos />
            </span>
            <calendar-month></calendar-month>
          </calendar-range>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
