import React from "react";

const StylesPage = () => {
  return (
    <div className="max-w-4xl mx-auto ">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Styles</h1>
      </div>
      <div className="rounded-lg shadow-lg p-8 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Style Editor</h2>
        <p className="text-gray-600 mb-6">
          Customize and manage your project's visual styles and themes.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-8 w-full bg-purple-600 rounded" />
            <div className="h-8 w-full bg-blue-600 rounded" />
            <div className="h-8 w-full bg-green-600 rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-8 w-full bg-gray-200 rounded" />
            <div className="h-8 w-full bg-gray-300 rounded" />
            <div className="h-8 w-full bg-gray-400 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylesPage;
