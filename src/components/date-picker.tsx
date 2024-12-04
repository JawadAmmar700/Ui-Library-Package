import React, { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Picker from "@/components/picker";
import { MONTHS, years } from "@/lib/constants";
import { cn } from "@/utils/cn";

interface DatePickerProps {
  theme?: "light" | "dark";
}

const DatePicker: React.FC<DatePickerProps> = ({ theme = "light" }) => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const days = useMemo(() => {
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();
    return Array.from({ length: daysInMonth }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
  }, [selectedDate]);

  const handleDateChange = useCallback(
    (
      type: "year" | "month" | "day",
      value: string | number | boolean | null
    ) => {
      setSelectedDate((prevDate) => {
        const newDate = new Date(prevDate);
        let newYear = newDate.getFullYear();
        let newMonth = newDate.getMonth();
        let newDay = newDate.getDate();

        switch (type) {
          case "year":
            newYear =
              value !== null
                ? parseInt(value.toString(), 10)
                : currentDate.getFullYear();
            break;
          case "month":
            newMonth =
              value !== null
                ? MONTHS.indexOf(value.toString())
                : currentDate.getMonth();
            break;
          case "day":
            newDay =
              value !== null
                ? parseInt(value.toString(), 10)
                : currentDate.getDate();
            break;
        }

        // Adjust for months with fewer days
        const lastDayOfMonth = new Date(newYear, newMonth + 1, 0).getDate();
        newDay = Math.min(newDay, lastDayOfMonth);

        return new Date(newYear, newMonth, newDay);
      });
    },
    [currentDate]
  );

  const changeMonth = useCallback((increment: number) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      const currentMonth = newDate.getMonth();
      const newMonth = (currentMonth + increment + 12) % 12; // Ensure it wraps around correctly
      const newYear =
        prevDate.getFullYear() + Math.floor((currentMonth + increment) / 12);
      const lastDayOfNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
      const newDay = Math.min(prevDate.getDate(), lastDayOfNewMonth);
      return new Date(newYear, newMonth, newDay);
    });
  }, []);

  const formattedDate = useMemo(() => {
    return selectedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [selectedDate]);

  const isDarkTheme = theme === "dark";

  const pickerClassName = cn(
    "border-t-2 border-b-2 border-r-0 border-l-0",
    isDarkTheme
      ? "text-white border-white bg-transparent rounded-none"
      : "text-black border-none bg-white rounded"
  );

  const buttonClassName = cn(
    "shadow-lg p-2 rounded",
    isDarkTheme ? "bg-white/10 hover:bg-white/15" : "bg-white hover:bg-black/10"
  );

  return (
    <div
      className={cn(
        "transition-all duration-300 max-w-md p-5 pt-5 shadow-lg rounded-lg",
        isDarkTheme ? "bg-black" : "bg-slate-50"
      )}
    >
      <div>
        <div
          className={`flex mt-[50px] ${
            isDarkTheme ? "space-x-0" : "space-x-1"
          }`}
        >
          <Picker
            componentWidth={150}
            visibleItems={3}
            soundEffect="click"
            options={MONTHS}
            onValueChange={(value) => handleDateChange("month", value)}
            scrollVelocity={2}
            ObserverClassName={pickerClassName}
            labelText="Month"
            initialValue={selectedDate.getMonth() + 1}
            itemClassName={theme === "light" ? "text-black" : ""}
          />
          <Picker
            componentWidth={100}
            visibleItems={3}
            soundEffect="click"
            onValueChange={(value) => handleDateChange("year", value)}
            scrollVelocity={2}
            options={years}
            labelText="Year"
            initialValue={years.indexOf(
              (selectedDate.getFullYear() + 1).toString()
            )}
            ObserverClassName={pickerClassName}
            itemClassName={theme === "light" ? "text-black" : ""}
          />
          <Picker
            componentWidth={80}
            visibleItems={3}
            soundEffect="click"
            onValueChange={(value) => handleDateChange("day", value)}
            scrollVelocity={2}
            options={days}
            labelText="Day"
            ObserverClassName={pickerClassName}
            initialValue={selectedDate.getDate()}
            itemClassName={theme === "light" ? "text-black" : ""}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <div
            className={`text-lg font-semibold ${
              isDarkTheme ? "text-white" : "text-black"
            }`}
            aria-live="polite"
          >
            {formattedDate}
          </div>
          <div className="flex space-x-2">
            <button
              className={buttonClassName}
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft
                className={`h-4 w-4 ${
                  isDarkTheme ? "text-white" : "text-black"
                }`}
              />
            </button>
            <button
              className={buttonClassName}
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight
                className={`h-4 w-4 ${
                  isDarkTheme ? "text-white" : "text-black"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
