import React, { useState, useCallback, useMemo } from "react";
import { Frameworks, ProjectsList } from "@/lib/constants";
import Picker from "@/components/re-uc/picker";

const CustomPicker = () => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(
    null
  );

  const handleChange = useCallback(
    (value: string | number | boolean | null) => {
      if (value) {
        setSelectedFramework(value.toString());
      } else {
        setSelectedFramework(null);
      }
    },
    []
  );

  const filteredProjects = useMemo(() => {
    return ProjectsList.filter(
      (project) =>
        project.ref.toLowerCase() === selectedFramework?.toLowerCase()
    ).map((project) => project.name);
  }, [selectedFramework]);

  return (
    <div className="flex space-x-2 dark:bg-transparent bg-white ">
      <Picker
        width={65}
        inView={2}
        sound="pop"
        data={Frameworks}
        onChange={handleChange}
        velocity={2}
        firstItem="Choose"
      />

      {selectedFramework && (
        <Picker
          width={200}
          inView={4}
          label="Project"
          sound="click"
          data={filteredProjects}
          onChange={(value) => console.log(value)}
          velocity={2}
          firstItem="Choose"
          mute={false}
        />
      )}
    </div>
  );
};

export default CustomPicker;
