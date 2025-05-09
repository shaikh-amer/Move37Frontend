import { DisplayItem } from "@/types/types";

export const displayFormat: DisplayItem = {
  font: {
    displayText: {
      keywords: [],
      html: "",
      text: "",
    },
    fontName: "sans-serif",
    textShadowWidthFr: 0.04,
    textAlign: "center",
    keywordColor: "rgba(255,255,255,1)",
    textShadowColor: "rgba(0,0,0,1)",
    fontSize: "30",
    decoration: ["bold"],
    textBackgroundColor: "rgba(0,0,0,0)",
    case: "case-none",
    fontColor: "#FAFAFA",
    paragraphWidth: "90%",
    preset: "center-center",
    fullWidth: false,
    animation: {
      text_animation: [
        {
          source: "templates",
          type: "start",
          speed: 1.5,
          animation: "none",
        },
        {
          source: "templates",
          type: "end",
          speed: 1.05,
          animation: "none",
        },
      ],
      text_bg_animation: [
        {
          source: "templates",
          type: "start",
          speed: 1.5,
          animation: "none",
        },
        {
          source: "templates",
          type: "end",
          speed: 1.05,
          animation: "none",
        },
      ],
    },
    styleIdObj: {
      id: "e91cd530-d2f2-4e1a-9572-22176bc4b5c0",
      scope: "global",
      modified: true,
    },
    customFontMeta: {},
    size: 30,
    line_height: 88,
    line_spacing: 1.2,
    name: "sans-serif.ttf",
    color: "#FAFAFA",
    keycolor: "rgba(255,255,255,1)",
    backcolor: "rgba(0,0,0,0)",
  },
  location: {
    preset: "center-center",
    center_x: 950.88888888888886,
    start_y: 612.4444444444445,
  },
  text_lines: [
    {
      text_animation: [
        {
          source: "templates",
          type: "start",
          speed: 1.5,
          animation: "none",
        },
        {
          source: "templates",
          type: "end",
          speed: 1.05,
          animation: "none",
        },
      ],
      text_bg_animation: [
        {
          source: "templates",
          type: "start",
          speed: 1.5,
          animation: "none",
        },
        {
          source: "templates",
          type: "end",
          speed: 1.05,
          animation: "none",
        },
      ],
      text: "add text ",
    },
  ],
  type: "text",
};
