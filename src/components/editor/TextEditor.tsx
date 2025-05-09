"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react";
import "react-quill/dist/quill.snow.css";
import { Card } from "@/components/ui/card";
import { customFonts } from "@/lib/customFonts";
import FontFamilySelect from "@/lib/FontfamilySelect";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentText } from "@/redux/textSlice";
import { RootState } from "@/redux/store";
import { updateSceneText } from "@/redux/screenSlice";

// Polyfill ReactDOM.findDOMNode for React 19 compatibility
if (typeof window !== "undefined") {
  const ReactDOM = require("react-dom");

  if (!ReactDOM.findDOMNode) {
    ReactDOM.findDOMNode = function (component: any): HTMLElement | null {
      if (component == null) {
        return null;
      }
      if (typeof component === "string" || typeof component === "number") {
        return document.createTextNode(
          String(component),
        ) as unknown as HTMLElement;
      }
      if (component instanceof HTMLElement) {
        return component;
      }
      if (component._reactInternals && component._reactInternals.stateNode) {
        return component._reactInternals.stateNode;
      }
      if (component.current && component.current instanceof HTMLElement) {
        return component.current;
      }
      return null;
    };
  }
}

// Dynamic import ReactQuill without using findDOMNode
const ReactQuill = dynamic(
  () =>
    import("react-quill").then((mod) => {
      const ReactQuillWrapper = forwardRef((props: any, ref: any) => {
        const { onChange, ...rest } = props;
        return (
          <mod.default
            ref={ref}
            onChange={(content, delta, source, editor) => {
              if (onChange) {
                onChange(content, editor);
              }
            }}
            {...rest}
          />
        );
      });

      ReactQuillWrapper.displayName = "ReactQuillWrapper";
      return ReactQuillWrapper;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="h-[150px] bg-gray-200 rounded-md animate-pulse"></div>
    ),
  },
);

// Register fonts only on client side
if (typeof window !== "undefined") {
  const Quill = require("react-quill").Quill;
  const Font = Quill.import("formats/font");
  Font.whitelist = customFonts.map((f) => f.value);
  Quill.register(Font, true);
}

interface TextEditorProps {
  value: string;

  onFormatChange?: (format: any) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onFormatChange }) => {
  const dispatch = useDispatch();

  const selectedScene = useSelector(
    (state: RootState) => state.reduxScene.selectedScene,
  );
  const selectedTextIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedTextIndex,
  );
  const selectedSceneIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedSceneIndex,
  );

  const quillRef = useRef<any>(null);

  // Extract font object from Redux safely
  const selectedFontObj =
    selectedScene?.sub_scenes?.[0]?.displayItems?.[selectedTextIndex || 0]
      ?.font;

  // Constants
  const DEFAULT_FONT = "Arial";
  const DEFAULT_SIZE = 30;
  const DEFAULT_COLOR = "#000000";

  // Local states initialized from font object or default
  const [localValue, setLocalValue] = useState(value);
  const [fontSize, setFontSize] = useState<number>(
    selectedFontObj?.fontSize
      ? parseInt(selectedFontObj.fontSize)
      : DEFAULT_SIZE,
  );
  const [selectedFont, setSelectedFont] = useState<string>(
    selectedFontObj?.fontName || DEFAULT_FONT,
  );
  const [fontColor, setFontColor] = useState<string>(
    selectedFontObj?.fontColor || DEFAULT_COLOR,
  );

  // React to Redux font updates
  useEffect(() => {
    if (selectedFontObj) {
      setFontSize(
        selectedFontObj.fontSize
          ? parseInt(selectedFontObj.fontSize)
          : DEFAULT_SIZE,
      );
      setSelectedFont(selectedFontObj.fontName || DEFAULT_FONT);
      setFontColor(selectedFontObj.fontColor || DEFAULT_COLOR);
    }
  }, [selectedFontObj]);

  // Minimal Quill modules (no built-in font dropdown)
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "font",
  ];

  const handleChange = useCallback(
    (content: string, editor: any) => {
      const newContent = content.trim() === "<p><br></p>" ? "" : content;
      setLocalValue(newContent);

      dispatch(setCurrentText(newContent));
      if (selectedTextIndex !== null) {
        dispatch(
          updateSceneText({
            sceneIndex: selectedSceneIndex,
            textIndex: selectedTextIndex,
            newText: newContent,
          }),
        );
      }

      const actualEditor =
        editor && typeof editor.getFormat === "function"
          ? editor
          : quillRef.current?.getEditor?.();

      if (actualEditor && onFormatChange) {
        const format = actualEditor.getFormat();
        const formatWithSize = {
          ...format,
          size: fontSize.toString(),
          font: selectedFont,
          color: fontColor,
        };
        onFormatChange(formatWithSize);
      }
    },
    [onFormatChange, fontSize, selectedFont, fontColor],
  );
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (editor && onFormatChange) {
      const handleSelectionChange = (range: any, source: any) => {
        if (range && source === "user") {
          const format = editor.getFormat();
          const formatWithSize = {
            ...format,
            size: fontSize.toString(),
            font: selectedFont,
            color: fontColor,
          };
          onFormatChange(formatWithSize);
        }
      };
      editor.on("selection-change", handleSelectionChange);
      return () => {
        editor.off("selection-change", handleSelectionChange);
      };
    }
  }, [onFormatChange, fontSize, selectedFont, fontColor]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (editor) {
      editor.focus();
      editor.setSelection(editor.getLength(), 0);
    }
  }, []);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setFontSize(newSize);

    const editor = quillRef.current?.getEditor?.();
    if (editor && onFormatChange) {
      const format = editor.getFormat();
      onFormatChange({
        ...format,
        size: newSize.toString(),
        font: selectedFont,
        color: fontColor,
      });
    }
  };

  const handleFontFamilyChange = (newFont: string) => {
    setSelectedFont(newFont);
    const editor = quillRef.current?.getEditor?.();
    if (editor) {
      editor.format("font", newFont);
    }
    if (onFormatChange && editor) {
      const format = editor.getFormat();
      onFormatChange({
        ...format,
        size: fontSize.toString(),
        font: newFont,
        color: fontColor,
      });
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-4">
      {/* Our custom Radix UI Select for font family */}
      <div className="mb-4 w-full">
        <FontFamilySelect
          fonts={customFonts}
          selectedFont={selectedFont}
          onValueChange={handleFontFamilyChange}
        />
      </div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={localValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
        style={{ minHeight: "150px" }}
      />

      <div className="mt-4 flex items-center">
        <label className="text-black dark:text-white mr-4">
          Font Size: {fontSize}px
        </label>
        <input
          type="range"
          min="10"
          max="72"
          step="1"
          value={fontSize}
          onChange={handleFontSizeChange}
          className="w-full appearance-none h-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
        />
      </div>
    </Card>
  );
};

export default TextEditor;
