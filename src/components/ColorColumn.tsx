import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { ColorColumn as ColorColumnType } from '../types/colors';
import { hslToHex, hexToHSL, hslToString } from '../utils/colorUtils';

interface ColorColumnProps {
  column: ColorColumnType;
  onToggleLock: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
}

export function ColorColumn({ column, onToggleLock, onColorChange }: ColorColumnProps) {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = e.target.value;
    const hslColor = hexToHSL(hexColor);
    onColorChange(column.id, hslToString(hslColor));
  };

  // Convert HSL to hex for the color input
  const getHexColor = () => {
    try {
      // Extract HSL values using regex
      const match = column.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
        const [, h, s, l] = match.map(Number);
        return hslToHex({ h, s, l });
      }
      return '#000000';
    } catch (error) {
      return '#000000';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div 
          className="w-24 h-24 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: column.color }}
        />
        <input
          type="color"
          value={getHexColor()}
          onChange={handleColorChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-sm font-medium text-gray-700">{column.name}</p>
      <p className="text-xs font-mono text-gray-500">{column.color}</p>
      <button
        onClick={() => onToggleLock(column.id)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        {column.locked ? (
          <Lock className="w-4 h-4 text-gray-700" />
        ) : (
          <Unlock className="w-4 h-4 text-gray-400" />
        )}
      </button>
    </div>
  );
}