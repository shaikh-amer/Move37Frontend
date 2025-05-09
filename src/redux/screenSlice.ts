import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DisplayItem } from "@/types/types";
import { displayFormat } from "@/lib/displayItem";

// Define payload for updating display format
interface UpdateDisplayFormatPayload {
  sceneIndex: number;
  displayFormat: DisplayItem;
}

interface UpdateSceneTextPayload {
  sceneIndex: number;
  textIndex: number;
  newText: string;
}

interface ToggleSubtitle {
  sceneIndex: number;
  subtitleToggle: boolean;
}
interface BackgroundMucic {
  bgSrc: string;
}

// Check if code is running in browser
const isBrowser = typeof window !== "undefined";

// Functions to retrieve saved state from localStorage
export const getInitialScenes = () => {
  if (!isBrowser) return [];

  try {
    const savedScenes = localStorage.getItem("sceneSettings");
    return savedScenes ? JSON.parse(savedScenes) : [];
  } catch (error) {
    return [];
  }
};

const getData = () => {
  if (!isBrowser) return {};

  try {
    const data = localStorage.getItem("data");
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
};

const getAudioSettings = () => {
  if (!isBrowser) {
    return {
      video_volume: 1,
      audio_id: "",
      audio_library: "",
      src: "",
      track_volume: 1,
      tts: "",
    };
  }

  try {
    const audioSettings = localStorage.getItem("audioSettings");
    return audioSettings
      ? JSON.parse(audioSettings)
      : {
          video_volume: 1,
          audio_id: "",
          audio_library: "",
          src: "",
          track_volume: 1,
          tts: "",
        };
  } catch (error) {
    return {
      video_volume: 1,
      audio_id: "",
      audio_library: "",
      src: "",
      track_volume: 1,
      tts: "",
    };
  }
};

const initialState = {
  sceneSettings: getInitialScenes(),
  audioSettings: getAudioSettings(),
  videoUrl: "",
  data: getData(),
  aspectRatio: "16:9", // Default aspect ratio
  subtitleToggle: true,
};

const sceneSlice = createSlice({
  name: "SceneSettings",
  initialState,
  reducers: {
    setScenes: (state, action: PayloadAction<any>) => {
      state.sceneSettings = action.payload;
      if (isBrowser) {
        try {
          localStorage.setItem("sceneSettings", JSON.stringify(action.payload));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
      }
    },
    setAspectRatio: (state, action: PayloadAction<string>) => {
      state.aspectRatio = action.payload;
      localStorage.setItem("aspectRatio", JSON.stringify(action.payload));
    },
    setBackgroundMusicSrc: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        state.data.audioSettings.src = action.payload;

        if (isBrowser) {
          try {
            localStorage.setItem("data", JSON.stringify(state.data));
          } catch (error) {
            console.error("Error saving data to localStorage:", error);
          }
        }
      }
    },

    setVideoUrl: (state, action: PayloadAction<string>) => {
      state.videoUrl = action.payload;
    },

    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
      if (isBrowser) {
        try {
          localStorage.setItem("data", JSON.stringify(action.payload));
        } catch (error) {
          console.error("Error saving data to localStorage:", error);
        }
      }
    },

    setAudioSettings: (state, action: PayloadAction<any>) => {
      state.data = {
        ...state.data,
        audioSettings: action.payload, // Update data.audioSettings
      };
      state.audioSettings = action.payload;

      if (isBrowser) {
        try {
          localStorage.setItem("audioSettings", JSON.stringify(action.payload));
          localStorage.setItem(
            "data",
            JSON.stringify({
              ...state.data,
              audioSettings: action.payload,
            }),
          );
        } catch (error) {
          console.error("Error saving audioSettings to localStorage:", error);
        }
      }
    },

    // New reducer to update a scene's display format (displayItems)
    updateSceneDisplayFormat: (
      state,
      action: PayloadAction<UpdateDisplayFormatPayload>,
    ) => {
      const { sceneIndex, displayFormat } = action.payload;
      const scenes = state.sceneSettings.scenesSettings || state.sceneSettings;
      // Ensure sceneSettings exists and scenesSettings is an array

      if (Array.isArray(scenes)) {
        if (sceneIndex >= 0 && sceneIndex < scenes.length) {
          const scene = scenes[sceneIndex];

          // Check if sub_scenes exists and has at least one subscene.
          if (scene.sub_scenes && scene.sub_scenes.length > 0) {
            // Directly update the displayItems array using Immer's mutability
            scene.sub_scenes[0].displayItems.length === 0 ||
            scene.sub_scenes[0].displayItems[0].type === "visual"
              ? (scene.sub_scenes[0].displayItems = [])
              : "";
            scene.sub_scenes[0].displayItems.push(displayFormat);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("sceneSettings", JSON.stringify(scenes));
              } catch (error) {
                console.error(
                  "Error saving updated sceneSettings to localStorage:",
                  error,
                );
              }
            }
          }
        }
      }
    },

    updateSceneText: (state, action: PayloadAction<UpdateSceneTextPayload>) => {
      const { sceneIndex, textIndex, newText } = action.payload;
      const scenes = state.sceneSettings.scenesSettings || state.sceneSettings;
      if (scenes && Array.isArray(scenes)) {
        const scene = scenes[sceneIndex];
        if (scene) {
          scene.sub_scenes[0].displayItems[textIndex].text_lines[0].text =
            newText;
          // Update localStorage with new scenes
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("sceneSettings", JSON.stringify(scenes));
            } catch (error) {
              console.error(
                "Error saving updated sceneSettings to localStorage:",
                error,
              );
            }
          }
        }
      }
    },

    setToggleSubtitle: (state, action: PayloadAction<ToggleSubtitle>) => {
      const { sceneIndex, subtitleToggle } = action.payload;
      const scenes = state.sceneSettings.scenesSettings || state.sceneSettings;
      const scene = scenes[sceneIndex];
      if (Array.isArray(scenes)) {
        scenes.forEach((scene) => {
          if (subtitleToggle) {
            scene.subtitle = subtitleToggle;
            scene.sub_scenes[0].text_lines[0].text = scene.subtitles[0].text;
          } else {
            scene.subtitle = subtitleToggle;
            scene.sub_scenes[0].text_lines[0].text = "";
          }
        });

        // scene.sub_scenes[0].subtitle=subtitleToggle
        state.subtitleToggle = subtitleToggle;

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("sceneSettings", JSON.stringify(scenes));
          } catch (error) {
            console.error(
              "Error saving updated sceneSettings to localStorage:",
              error,
            );
          }
        }
      }
    },

    updateSceneTextStyle: (
      state,
      action: PayloadAction<{
        sceneIndex: number;
        textIndex: number;
        newStyle: {
          fontColor?: string;
          textBackgroundColor?: string;
          fontName?: string;
          fontSize?: number;
          decoration?: string[];
        };
      }>,
    ) => {
      const { sceneIndex, textIndex, newStyle } = action.payload;

      // Filter out undefined properties from newStyle.
      let filteredStyle: { [key: string]: any } = {};
      Object.keys(newStyle).forEach((key) => {
        if (newStyle[key as keyof typeof newStyle] !== undefined) {
          filteredStyle[key] = newStyle[key as keyof typeof newStyle];
        }
      });

      // Update extra keys for color and background.
      if (filteredStyle.fontColor !== undefined) {
        filteredStyle.color = filteredStyle.fontColor;
      }
      if (filteredStyle.textBackgroundColor !== undefined) {
        filteredStyle.backcolor = filteredStyle.textBackgroundColor;
      }
      if (filteredStyle.fontName !== undefined) {
        filteredStyle.name = filteredStyle.fontName;
      }
      if (filteredStyle.fontSize !== undefined) {
        filteredStyle.size = filteredStyle.fontSize;
      }

      const scenes = state.sceneSettings.scenesSettings || state.sceneSettings;
      if (Array.isArray(scenes)) {
        const scene = scenes[sceneIndex];
        if (
          scene.sub_scenes &&
          scene.sub_scenes.length > 0 &&
          textIndex < scene.sub_scenes[0].displayItems.length
        ) {
          scene.sub_scenes[0].displayItems[textIndex].font = {
            ...displayFormat.font,
            ...scene.sub_scenes[0].displayItems[textIndex].font,
            ...filteredStyle,
          };

          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("sceneSettings", JSON.stringify(scenes));
            } catch (error) {
              console.error(
                "Error saving updated sceneSettings to localStorage:",
                error,
              );
            }
          }
        }
      }
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.audioSettings.video_volume = action.payload;
      state.data.audioSettings.video_volume = action.payload;
      state.audioSettings.amplifyLevel = action.payload;
      state.data.audioSettings.amplifyLevel = action.payload;

      if (isBrowser) {
        try {
          localStorage.setItem(
            "audioSettings",
            JSON.stringify(state.audioSettings),
          );
          localStorage.setItem("data", JSON.stringify(state.data));
        } catch (error) {
          console.error("Error saving audioSettings to localStorage:", error);
        }
      }
    },
    setBGvolume: (state, action: PayloadAction<number>) => {
      state.audioSettings.track_volume = action.payload;
      state.data.audioSettings.track_volume = action.payload;
      state.audioSettings.backGroundMusicVolume = action.payload;
      state.data.audioSettings.backGroundMusicVolume = action.payload;

      if (isBrowser) {
        try {
          localStorage.setItem(
            "audioSettings",
            JSON.stringify(state.audioSettings),
          );
          localStorage.setItem("data", JSON.stringify(state.data));
        } catch (error) {
          console.error("Error saving audioSettings to localStorage:", error);
        }
      }
    },
  },
});

export const {
  setScenes,
  setVideoUrl,
  setData,
  setAudioSettings,
  updateSceneDisplayFormat,
  updateSceneText,
  updateSceneTextStyle,
  setAspectRatio,
  setToggleSubtitle,
  setBackgroundMusicSrc,
  setVolume,
  setBGvolume,
} = sceneSlice.actions;

export default sceneSlice.reducer;
