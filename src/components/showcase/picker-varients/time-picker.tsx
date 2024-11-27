import React, { useState, useCallback, useMemo, useEffect } from "react";
import Picker from "@/components/re-uc/picker";
import { hours, minutes } from "@/lib/constants";
import { getSunSetAndSunRise } from "@/server/actions";
import { Moon, Sun } from "lucide-react";

interface Position {
  sunset: string;
  sunrise: string;
}

const periods = ["AM", "PM"];

export default function TimePicker() {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM" | null>(
    null
  );
  const [sunsetSunrise, setSunsetSunrise] = useState<Position | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude.toString();
          const longitude = position.coords.longitude.toString();
          const result = await getSunSetAndSunRise(latitude, longitude);
          setSunsetSunrise(result);
        },
        (error) => {
          console.log("Error getting location: " + error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const timeToMinutes = (time: string) => {
    const [hour, minuteWithPeriod] = time.split(":");
    const [minute, period] = minuteWithPeriod.split(" ");
    let hourIn24 = parseInt(hour);

    if (period === "PM" && hourIn24 !== 12) {
      hourIn24 += 12;
    } else if (period === "AM" && hourIn24 === 12) {
      hourIn24 = 0;
    }

    return hourIn24 * 60 + parseInt(minute);
  };

  const handleHourChange = useCallback(
    (value: string | number | boolean | null) => {
      setSelectedHour(value !== null ? parseInt(value.toString(), 10) : null);
    },
    []
  );

  const handleMinuteChange = useCallback(
    (value: string | number | boolean | null) => {
      setSelectedMinute(value !== null ? parseInt(value.toString(), 10) : null);
    },
    []
  );

  const handlePeriodChange = useCallback(
    (value: string | number | boolean | null) => {
      setSelectedPeriod(value as "AM" | "PM" | null);
    },
    []
  );

  const formattedTime = useMemo(() => {
    if (
      selectedHour === null &&
      selectedMinute === null &&
      selectedPeriod === null
    )
      return "-- : -- --";

    const hour =
      selectedHour !== null ? selectedHour.toString().padStart(2, "0") : "--";
    const minute =
      selectedMinute !== null
        ? selectedMinute.toString().padStart(2, "0")
        : "--";
    const period = selectedPeriod || "--";

    if (
      selectedHour !== null &&
      selectedPeriod === "PM" &&
      selectedHour !== 12
    ) {
      const pmHour = selectedHour % 12;
      return `${pmHour.toString().padStart(2, "0")}:${minute} ${period}`;
    }

    return `${hour}:${minute} ${period}`;
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const checkDayOrNight = useMemo(() => {
    if (!sunsetSunrise) return;
    const sunriseTime = timeToMinutes(sunsetSunrise.sunrise);
    const sunsetTime = timeToMinutes(sunsetSunrise.sunset);
    const selectedTime = timeToMinutes(formattedTime);

    if (selectedTime >= sunriseTime && selectedTime <= sunsetTime) {
      return "day";
    } else {
      return "night";
    }
  }, [formattedTime, sunsetSunrise]);

  return (
    <div
      className={`flex bg-slate-50 dark:bg-transparent shadow-lg space-x-2 relative transition-all duration-300 md:mt-0 rounded-lg pt-[70px] px-5 py-5`}
    >
      <Picker
        width={75}
        inView={3}
        sound="click"
        onChange={handleHourChange}
        velocity={2}
        data={hours}
        label="Hour"
        labelClassName="text-gray-700 dark:text-slate-200"
        defaultValue={new Date().getHours() % 12}
      />

      <Picker
        width={90}
        inView={3}
        sound="click"
        data={minutes}
        onChange={handleMinuteChange}
        velocity={2}
        label="Minute"
        labelClassName="text-gray-700 dark:text-slate-200"
        defaultValue={new Date().getMinutes() + 1}
      />

      <Picker
        width={90}
        inView={2}
        sound="click"
        onChange={handlePeriodChange}
        data={periods}
        velocity={2}
        label="Period"
        labelClassName="text-gray-700 dark:text-slate-200"
        defaultValue={new Date().getHours() >= 12 ? 2 : 1}
      />

      <div
        className={`text-2xl font-bold absolute right-5 rounded px-2 bottom-2 flex space-x-1 items-center justify-center transition-all duration-200 ease-in transform ${
          checkDayOrNight === "day"
            ? "text-gray-500 dark:text-slate-100"
            : "text-black dark:text-gray-400"
        }`}
        aria-live="polite"
      >
        {checkDayOrNight === "day" ? (
          <Sun className="h-5 w-5 mt-0.5 text-yellow-400 transition-all duration-200 ease-in transform" />
        ) : (
          <Moon className="h-5 w-5 text-blue-300 mt-0.5 transition-all duration-200 ease-out transform" />
        )}
        <div className="transition-all duration-200 ease-in">
          {formattedTime}
        </div>
      </div>
    </div>
  );
}
