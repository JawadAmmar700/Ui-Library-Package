import React from "react";
import MobileDrop from "../re-uc/mobile-drop";

const originalData = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

const MobileDropShowcase = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-2xl font-bold text-white mb-10 mx-auto text-center">
        This demo works only on mobile devices
      </h1>
      <MobileDrop
        list={originalData}
        onChange={(list) => console.log(list)}
        className="bg-white w-96 p-4 rounded-md"
      />
    </main>
  );
};

export default MobileDropShowcase;
