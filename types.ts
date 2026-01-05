export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  PREVIEW = 'PREVIEW',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface AnalysisResult {
  count: number;
  description: string;
  confidenceLevel?: string;
}

export interface ImageFile {
  data: string; // Base64 string
  mimeType: string;
}
