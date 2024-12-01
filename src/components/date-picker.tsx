import React, { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Picker from "@/components/picker";
import { MONTHS, years } from "@/lib/constants";

export default function Component() {
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
    <div className="max-w-md pt-5 dark:bg-black bg-slate-50 shadow-lg">
      <div>
        <div className="flex mt-[50px] space-x-1 dark:space-x-0">
          <Picker
            width={150}
            inView={3}
            sound="click"
            data={MONTHS}
            onChange={handleMonthChange}
            velocity={2}
            labelClassName="rounded-none dark:bg-transparent border-t-2 border-b-2 border-r-0 border-l-0 border-white"
            label="Month"
            defaultValue={selectedMonth + 1}
          />

          <Picker
            width={100}
            inView={3}
            sound="click"
            onChange={handleYearChange}
            velocity={2}
            data={years}
            labelClassName="rounded-none dark:bg-transparent border-t-2 border-b-2 border-r-0 border-l-0 border-white"
            label="Year"
            defaultValue={years.indexOf((selectedYear + 1).toString())}
          />

          <Picker
            width={80}
            inView={3}
            sound="click"
            onChange={handleDayChange}
            velocity={2}
            data={days}
            labelClassName="rounded-none dark:bg-transparent border-t-2 border-b-2 border-r-0 border-l-0 border-white"
            label="Day"
            defaultValue={selectedDay}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <div
            className="text-lg font-semibold dark:text-white text-black"
            aria-live="polite"
          >
            {formattedDate}
          </div>
          <div className="flex space-x-2">
            <button
              className="dark:bg-white/10 bg-white shadow-lg  hover:dark:bg-white/15 hover:bg-black/10"
              onClick={decrementMonth}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4 dark:text-white text-black " />
            </button>
            <button
              className="dark:bg-white/10 bg-white shadow-lg  hover:dark:bg-white/15 hover:bg-black/10"
              onClick={incrementMonth}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4 dark:text-white text-black " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
