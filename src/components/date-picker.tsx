import React, { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Picker from "@/components/picker";
import { MONTHS, years } from "@/lib/constants";
import { cn } from "@/utils/cn";

interface DatePickerProps {
  theme: "light" | "dark";
}

const DatePicker = ({ theme }: DatePickerProps) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const days = useMemo(() => {
    return Array.from(
      { length: new Date(selectedYear, selectedMonth + 1, 0).getDate() },
      (_, i) => (i + 1).toString().padStart(2, "0")
    );
  }, [selectedMonth, selectedYear]);

  const handleYearChange = useCallback(
    (value: string | number | boolean | null) => {
      const year =
        value !== null ? parseInt(value.toString(), 10) : currentYear;
      setSelectedYear(year);
    },
    [currentYear]
  );

  const handleMonthChange = useCallback(
    (value: string | number | boolean | null) => {
      const month =
        value !== null
          ? MONTHS.indexOf(value.toString())
          : new Date().getMonth();
      setSelectedMonth(month);
    },
    []
  );

  const handleDayChange = useCallback(
    (value: string | number | boolean | null) => {
      setSelectedDay(
        value !== null ? parseInt(value.toString(), 10) : new Date().getDate()
      );
    },
    []
  );

  const incrementMonth = useCallback(() => {
    setSelectedMonth((month) => {
      if (month === 11) {
        setSelectedYear((year) => year + 1);
        return 0;
      }
      return month + 1;
    });
  }, []);

  const decrementMonth = useCallback(() => {
    setSelectedMonth((month) => {
      if (month === 0) {
        setSelectedYear((year) => year - 1);
        return 11;
      }
      return month - 1;
    });
  }, []);

  const formattedDate = useMemo(() => {
    return new Date(
      selectedYear,
      selectedMonth,
      selectedDay
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [selectedYear, selectedMonth, selectedDay]);

  return (
    <div
      className={cn(
        `transition-all duration-300 max-w-md p-5 pt-5 ${
          theme === "dark" ? "bg-black" : "bg-slate-50"
        } shadow-lg rounded-lg`,
        ""
      )}
    >
      <div>
        <div
          className={`flex mt-[50px] ${
            theme === "dark" ? "space-x-0" : "space-x-1"
          }`}
        >
          <Picker
            componentWidth={150}
            visibleItems={3}
            soundEffect="click"
            options={MONTHS}
            onValueChange={handleMonthChange}
            scrollVelocity={2}
            labelClassName={`${
              theme === "dark"
                ? "text-white border-white bg-transparent rounded-none"
                : "text-black border-none bg-white rounded"
            }   border-t-2 border-b-2 border-r-0 border-l-0 `}
            labelText="Month"
            initialValue={selectedMonth + 1}
            itemClassName={`${theme === "dark" ? "text-white" : "text-black"}`}
          />

          <Picker
            componentWidth={100}
            visibleItems={3}
            soundEffect="click"
            onValueChange={handleYearChange}
            scrollVelocity={2}
            options={years}
            labelText="Year"
            initialValue={years.indexOf((selectedYear + 1).toString())}
            labelClassName={`${
              theme === "dark"
                ? "text-white border-white bg-transparent rounded-none "
                : "text-black border-none bg-white rounded"
            }  border-t-2 border-b-2 border-r-0 border-l-0 `}
            itemClassName={`${theme === "dark" ? "text-white" : "text-black"}`}
          />

          <Picker
            componentWidth={80}
            visibleItems={3}
            soundEffect="click"
            onValueChange={handleDayChange}
            scrollVelocity={2}
            options={days}
            labelText="Day"
            labelClassName={`${
              theme === "dark"
                ? "text-white border-white bg-transparent rounded-none "
                : "text-black border-none bg-white rounded"
            }   border-t-2 border-b-2 border-r-0 border-l-0 `}
            initialValue={selectedDay}
            itemClassName={`${theme === "dark" ? "text-white" : "text-black"}`}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <div
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
            aria-live="polite"
          >
            {formattedDate}
          </div>
          <div className="flex space-x-2">
            <button
              className={`${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/15"
                  : "bg-white hover:bg-black/10"
              } shadow-lg p-2 rounded`}
              onClick={decrementMonth}
              aria-label="Previous month"
            >
              <ChevronLeft
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              />
            </button>
            <button
              className={`${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/15"
                  : "bg-white hover:bg-black/10"
              } shadow-lg p-2 rounded`}
              onClick={incrementMonth}
              aria-label="Next month"
            >
              <ChevronRight
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-white" : "text-black"
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
