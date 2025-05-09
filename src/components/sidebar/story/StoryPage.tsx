import React from "react";
import StoryText from "./StoryText";

const StoryPage = () => {
  return (
    <div className="mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Story</h1>
      </div>
      <StoryText />
    </div>
  );
};

export default StoryPage;
