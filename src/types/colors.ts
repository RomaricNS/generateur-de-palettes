export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ColorColumn {
  id: string;
  name: string;
  color: string;
  locked: boolean;
}