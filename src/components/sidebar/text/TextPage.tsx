import React from "react";
import TextEditor from "../../editor/TextEditor";
import TextEditorSideBar from "./TextEditorSidebar";

const TextPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Text</h1>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Text Editor</h2>
        <p className="text-gray-600 mb-6">
          Create and edit your text content with advanced formatting options.
        </p>
        <TextEditorSideBar />
      </div>
    </div>
  );
};

export default TextPage;
