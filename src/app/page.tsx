"use client";
import FileUpload from "@/Components/FileUpload";
import { useState } from "react";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("detection");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Choose an option:</h1>
      <div>
        {["detection", "segmentation"].map((option) => (
          <label key={option}>
            <input
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={handleChange}
            />
            {option}
          </label>
        ))}
      </div>
      <FileUpload task={selectedOption} />
    </div>
  );
}
