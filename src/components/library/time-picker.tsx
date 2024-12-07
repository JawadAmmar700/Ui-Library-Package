import React, { useCallback, useMemo, useEffect, useReducer } from "react";
import Picker from "@/components/library/picker";
import { hours, minutes } from "@/lib/constants";
import { getSunSetAndSunRise } from "@/server/actions";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/utils/cn";
import Cookies from "js-cookie";
import { ClassValue } from "clsx";

interface Position {
  sunset: string;
  sunrise: string;
}

interface TimePickerProps {
  theme: "light" | "dark";
  className?: ClassValue;
  onTimeChange: (time: string) => void;
}

const periods = ["AM", "PM"];

type InitialStateType = {
  selectedHour: number | null;
  selectedMinute: number | null;
  selectedPeriod: "AM" | "PM" | null;
};
type ActionType =
  | { type: "SET_HOUR"; payload: number | null }
  | { type: "SET_MINUTE"; payload: number | null }
  | { type: "SET_PERIOD"; payload: "AM" | "PM" | null };

const initialState: InitialStateType = {
  selectedHour: null,
  selectedMinute: null,
  selectedPeriod: null,
};

const reducer = (state: InitialStateType, action: ActionType) => {
  switch (action.type) {
    case "SET_HOUR":
      return { ...state, selectedHour: action.payload };
    case "SET_MINUTE":
      return { ...state, selectedMinute: action.payload };
    case "SET_PERIOD":
      return { ...state, selectedPeriod: action.payload };
    default:
      return state;
  }
};

export default function TimePicker({
  theme,
  className,
  onTimeChange,
}: TimePickerProps) {
  const sunsetSunrise = React.useRef<Position | null>(null);
  const [{ selectedHour, selectedMinute, selectedPeriod }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    const storedData = Cookies.get("TimePicker_Coordinates");
    if (storedData) {
      sunsetSunrise.current = JSON.parse(storedData);
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude.toString();
          const longitude = position.coords.longitude.toString();
          const result = await getSunSetAndSunRise(latitude, longitude);
          sunsetSunrise.current = result;
          Cookies.set("TimePicker_Coordinates", JSON.stringify(result), {
            expires: 1,
          });
        },
        (error) => {
          throw new Error(error.message);
        }
      );
    } else {
      throw new Error("Geolocation is not supported by this browser.");
    }
  }, []);

  const timeToMinutes = useCallback((time: string) => {
    const [hour, minuteWithPeriod] = time.split(":");
    const [minute, period] = minuteWithPeriod.split(" ");
    let hourIn24 = parseInt(hour);

    if (period === "PM" && hourIn24 !== 12) {
      hourIn24 += 12;
    } else if (period === "AM" && hourIn24 === 12) {
      hourIn24 = 0;
    }

    return hourIn24 * 60 + parseInt(minute);
  }, []);

  const formattedTime = useMemo(() => {
    if (
      selectedHour === null ||
      selectedMinute === null ||
      selectedPeriod === null
    )
      return "";

    const hour = selectedHour.toString().padStart(2, "0");
    const minute = selectedMinute.toString().padStart(2, "0");
    const period = selectedPeriod;

    if (
      selectedHour !== null &&
      selectedPeriod === "PM" &&
      selectedHour !== 12
    ) {
      const pmHour = selectedHour % 12;
      const PMTime = `${pmHour
        .toString()
        .padStart(2, "0")}:${minute} ${period}`;
      onTimeChange(PMTime);
      return PMTime;
    }

    const AMTime = `${hour}:${minute} ${period}`;

    onTimeChange(AMTime);

    return AMTime;
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const checkDayOrNight = useMemo(() => {
    if (!sunsetSunrise.current) return;
    const sunriseTime = timeToMinutes(sunsetSunrise.current.sunrise!);
    const sunsetTime = timeToMinutes(sunsetSunrise.current.sunset!);
    const selectedTime = timeToMinutes(formattedTime);

    if (selectedTime >= sunriseTime && selectedTime <= sunsetTime) {
      return "day";
    } else {
      return "night";
    }
  }, [formattedTime, sunsetSunrise]);

  return (
    <div
      className={cn(
        `${
          theme === "dark" ? "bg-black" : "bg-slate-50"
        } flex shadow-lg space-x-2 relative transition-all duration-300 md:mt-0 rounded-lg px-5 py-5`,
        className
      )}
    >
      <div className="flex mt-[50px] space-x-1">
        <Picker
          componentWidth={75}
          visibleItems={3}
          soundEffect="click"
          onValueChange={(value) =>
            dispatch({
              type: "SET_HOUR",
              payload: value !== null ? parseInt(value.toString(), 10) : null,
            })
          }
          scrollVelocity={2}
          options={hours}
          labelText="Hour"
          ObserverClassName={`  ${
            theme === "dark"
              ? "text-slate-200 border-white bg-white/10"
              : "text-gray-700 border-none bg-white"
          }`}
          itemClassName={`${theme === "dark" ? "text-white" : "text-black"}`}
          initialValue={
            new Date().getHours() == 12 ? 12 : new Date().getHours() % 12
          }
        />

        <Picker
          componentWidth={90}
          visibleItems={3}
          soundEffect="click"
          options={minutes}
          onValueChange={(value) =>
            dispatch({
              type: "SET_MINUTE",
              payload: value !== null ? parseInt(value.toString(), 10) : null,
            })
          }
          scrollVelocity={2}
          labelText="Minute"
          ObserverClassName={`  ${
            theme === "dark"
              ? "text-slate-200 border-white bg-white/10"
              : "text-gray-700 border-none bg-white"
          }`}
          itemClassName={`${theme === "dark" ? "text-white" : "text-black"}`}
          initialValue={new Date().getMinutes() + 1}
        />

        <Picker
          componentWidth={90}
          visibleItems={2}
          soundEffect="click"
          onValueChange={(value) =>
            dispatch({
              type: "SET_PERIOD",
              payload: value as "AM" | "PM" | null,
            })
          }
          options={periods}
          scrollVelocity={2}
          labelText="Period"
          ObserverClassName={`  ${
            theme === "dark"
              ? "text-slate-200 border-white bg-white/10"
              : "text-gray-700 border-none bg-white"
          }`}
          itemClassName={`${theme === "dark" ? "text-white" : "text-black"}`}
          initialValue={new Date().getHours() >= 12 ? 2 : 1}
        />
      </div>

      <div
        className="text-2xl font-bold absolute right-2 rounded px-2 bottom-2 flex space-x-1 items-center justify-center transition-all duration-200 ease-in transform"
        aria-live="polite"
      >
        {checkDayOrNight === "day" ? (
          <Sun className="h-5 w-5 mt-0.5 text-yellow-400 animate-scale" />
        ) : (
          <Moon className="h-5 w-5 text-blue-300 mt-0.5 animate-scale" />
        )}
      </div>
    </div>
  );
}
