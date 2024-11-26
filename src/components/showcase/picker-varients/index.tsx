import React from "react";
import CustomPicker from "./custom-picker";
import TimePicker from "./time-picker";
import DatePicker from "./date-picker";

const PickerVarients = () => {
  return (
    <main className="h-screen overflow-hidden  w-full py-5 grid md:grid-cols-2 md:grid-row-2 grid-cols-1">
      <div className="flex justify-center items-center md:border-r-2 border-b-2 border-black dark:border-white">
        <CustomPicker />
      </div>
      <div className="flex justify-center items-center md:border-l-2 md:border-b-2 border-black dark:border-white">
        <TimePicker />
      </div>
      <div className="md:col-span-2 flex px-5 md:px-0 justify-center items-center border-t-2  border-black dark:border-white">
        <DatePicker />
      </div>
    </main>
  );
};

export default PickerVarients;
