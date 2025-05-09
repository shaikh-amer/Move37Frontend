import React from "react";
import AIVoicesSelector from "@/components/video/VoiceOverSelector";

const AudioPage = () => {
  return (
    <div className="mx-auto ">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Audio</h1>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Audio Manager</h2>

        <AIVoicesSelector />
      </div>
    </div>
  );
};

export default AudioPage;
