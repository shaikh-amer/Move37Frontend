interface Background {
  src: Array<{
    url: string;
    asset_id: number;
    type: string;
    library: string;
    mode: string;
    frame: null | string;
    loop_video: boolean;
    mute: boolean;
    resource_id: number;
    sessionId: string;
  }>;
  color: string;
  bg_animation: {
    animation: string;
  };
}

interface TextAnimation {
  animation: string;
  source: string;
  speed: number;
  type: "start" | "end";
}

export interface TextLine {
  text: string;
  text_animation?: TextAnimation[];
  text_bg_animation?: TextAnimation[];
  position?: { x: number; y: number };
}

export interface Font {
  name: string;
  size: number;
  line_spacing: number;
  color: string;
  backcolor: string;
  keycolor: string;
  textShadowColor: string;
  textShadowWidthFr: number;
  line_height: number;
  case: null | string;
  decoration: string[];
  fullWidth: boolean;
}

export interface DisplayItemFont {
  displayText?: {
    keywords?: string[];
    html?: string;
    text?: string;
  };
  fontName?: string;
  textShadowWidthFr?: number;
  textAlign?: string;
  keywordColor?: string;
  textShadowColor?: string;
  fontSize?: string;
  decoration?: string[];
  textBackgroundColor?: string;
  case?: string;
  fontColor?: string;
  paragraphWidth?: string;
  preset?: string;
  fullWidth?: boolean;
  animation?: {
    text_animation?: {
      source?: string;
      type?: string;
      speed?: number;
      animation?: string;
    }[];
    text_bg_animation?: {
      source?: string;
      type?: string;
      speed?: number;
      animation?: string;
    }[];
  };
  styleIdObj?: {
    id?: string;
    scope?: string;
    modified?: boolean;
  };
  customFontMeta?: object;
  size?: number;
  line_height?: number;
  line_spacing?: number;
  name?: string;
  color?: string;
  keycolor?: string;
  backcolor?: string;
}

export interface DisplayItem {
  font?: DisplayItemFont;
  location?: {
    preset?: string;
    center_x?: number;
    start_y?: number;
  };
  text_lines?: {
    text_animation?: {
      source?: string;
      type?: string;
      speed?: number;
      animation?: string;
    }[];
    text_bg_animation?: {
      source?: string;
      type?: string;
      speed?: number;
      animation?: string;
    }[];
    text?: string;
  }[];
  type?: string;
}

interface SubScene {
  time: number;
  location: {
    center_x: number;
    start_y: number;
  };
  displayItems: DisplayItem[];
  text_lines: TextLine[];
  subtitle: string;
  showSceneNumber: string;
  font: Font;
}

interface Subtitle {
  text: string;
  time: number;
}

export interface Scene {
  background: Background;
  time: number;
  keywords: string[];
  sub_scenes: SubScene[];
  music: boolean;
  tts: boolean;
  subtitle: boolean;
  subtitles: Subtitle[];
  preview?: {
    url: string;
  };
}

export interface VideoPlayerProps {
  videoUrl: string;
  backgroundColor: string;
  textLines: TextLine[];
}

export interface AudioSettings {
  video_volume: number;
  audio_id: string;
  audio_library: string;
  src: string;
  track_volume: number;
  tts: string;
}

export interface DraggableTextProps {
  text: string;
  position: { x: number; y: number };
  onDelete: () => void;
  onPositionChange: (x: number, y: number) => void;
  onTextChange: (newText: string) => void;
  isSelected: boolean;
  onClick: () => void;
}

export interface VisualTemplate {
  aspect_ratio: string;
  assetId: string;
  caption: string;
  duration: number;
  id: string;
  imageMetadata: {
    media_type: string;
    preview: string;
    preview_jpg: string;
    thumb: string;
    thumb_jpg: string;
  };
  keyword: string;
  license_model: string;
  mediaDescription: string;
  mediaType: string;
  orientation: string;
  preview: {
    jpg: string;
    url: string;
  };
  searchLibrary: string;
  thumbnail: {
    jpg: string;
    url: string;
  };
}

export interface VisualTemplateResponse {
  data: {
    page: number;
    searchResults: VisualTemplate[];
  };
  success: boolean;
}
