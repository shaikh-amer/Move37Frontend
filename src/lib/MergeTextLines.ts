import { Scene, TextLine } from "@/types/types";

export function mergeTextLines(renderData: Scene[]): Scene[] {
  // Deep copy the data to avoid read-only errors
  const deepCopy: Scene[] = JSON.parse(JSON.stringify(renderData));

  return deepCopy.map((item) => {
    // Since sub_scenes array is always of length 1, we work on the first sub_scene
    if (item.sub_scenes && item.sub_scenes.length > 0) {
      const subScene = item.sub_scenes[0];

      if (subScene.text_lines && subScene.text_lines.length > 0) {
        // Merge all text values into one string
        const mergedText = subScene.text_lines.map((tl) => tl.text).join(" ");
        // Retain animation settings from the first text_line (assuming they're the same)
        const mergedTextLine = {
          text: mergedText,
          text_animation: subScene.text_lines[0].text_animation,
          text_bg_animation: subScene.text_lines[0].text_bg_animation,
        };
        // Replace the text_lines array with the merged text line
        subScene.text_lines = [mergedTextLine];
      }
    }
    return item;
  });
}

const str =
  "Aero India: a symphony of engineering prowess, where cutting-edge aircraft paint gagan";
const maxLength = str.length;

export function splitTextLines({ text_lines }: any) {
  const result = [];

  for (const item of text_lines) {
    const { text, text_animation, text_bg_animation } = item;

    if (text.length <= maxLength) {
      result.push(item);
      continue;
    }

    const words = text.split(" ");
    const chunk = [];

    let currentLength = 0;
    for (const word of words) {
      // Plus 1 for the space (if not first word)
      const wordLength = word.length + (chunk.length > 0 ? 1 : 0);

      if (currentLength + wordLength <= maxLength) {
        chunk.push(word);
        currentLength += wordLength;
      } else {
        // Add current chunk
        result.push({
          text: chunk.join(" "),
          text_animation,
          text_bg_animation,
        });
        // Start new chunk
        chunk.length = 0;
        chunk.push(word);
        currentLength = word.length;
      }
    }

    // Add any remaining chunk
    if (chunk.length > 0) {
      result.push({
        text: chunk.join(" "),
        text_animation,
        text_bg_animation,
      });
    }
  }

  return result;
}

export const getFormattedSubtitleText = (scenes: Scene[]): string => {
  if (!Array.isArray(scenes)) return "";
  const lines = scenes
    .map((scene, index) => {
      const text = scene.subtitles?.[0]?.text;
      return text;
    })
    .filter((line): line is string => line !== null);

  return lines.join("\n");
};
