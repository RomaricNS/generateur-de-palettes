import React, { useState, useEffect, useCallback } from 'react';
import { ColorColumn as ColorColumnComponent } from './components/ColorColumn';
import { ColorColumn } from './types/colors';
import {
  generateRandomHSLColor,
  generateRandomWhite,
  generateOffWhite,
  generateTitleBlack,
  generateParagraphBlack,
  getComplementaryColor,
  getLighterShade,
  getDarkerShade,
  hslToString,
  hexToHSL,
} from './utils/colorUtils';

function App() {
  const [columns, setColumns] = useState<ColorColumn[]>(() => {
    const baseColor = generateRandomHSLColor();
    return [
      { id: 'base', name: 'Couleur de base', color: hslToString(baseColor), locked: false },
      { id: 'light', name: 'Déclinaison claire', color: hslToString(getLighterShade(baseColor)), locked: false },
      { id: 'dark', name: 'Déclinaison foncée', color: hslToString(getDarkerShade(baseColor)), locked: false },
      { id: 'complement', name: 'Couleur opposée', color: hslToString(getComplementaryColor(baseColor)), locked: false },
      { id: 'pureWhite', name: 'Blanc pur', color: hslToString(generateRandomWhite()), locked: false },
      { id: 'offWhite', name: 'Blanc cassé', color: hslToString(generateOffWhite()), locked: false },
      { id: 'titleBlack', name: 'Noir de titre', color: hslToString(generateTitleBlack()), locked: false },
      { id: 'paragraphBlack', name: 'Noir de paragraphe', color: hslToString(generateParagraphBlack()), locked: false },
    ];
  });

  const generateNewPalette = useCallback(() => {
    setColumns(prev => {
      const baseColumn = prev.find(col => col.id === 'base');
      let baseColor;

      // Si base color est verrouillée, l'utiliser comme référence
      if (baseColumn?.locked) {
        baseColor = hexToHSL(baseColumn.color);
      } else {
        baseColor = generateRandomHSLColor();
      }

      return prev.map(column => {
        // Si la colonne est verrouillée, garder son état actuel
        if (column.locked) {
          return column;
        }

        // Générer de nouvelles couleurs selon le type de colonne
        switch (column.id) {
          case 'base':
            return { ...column, color: hslToString(baseColor) };
          case 'light':
            return { ...column, color: hslToString(getLighterShade(baseColor)) };
          case 'dark':
            return { ...column, color: hslToString(getDarkerShade(baseColor)) };
          case 'complement':
            return { ...column, color: hslToString(getComplementaryColor(baseColor)) };
          case 'pureWhite':
            return { ...column, color: hslToString(generateRandomWhite()) };
          case 'offWhite':
            return { ...column, color: hslToString(generateOffWhite()) };
          case 'titleBlack':
            return { ...column, color: hslToString(generateTitleBlack()) };
          case 'paragraphBlack':
            return { ...column, color: hslToString(generateParagraphBlack()) };
          default:
            return column;
        }
      });
    });
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      generateNewPalette();
    }
  }, [generateNewPalette]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const toggleLock = (id: string) => {
    setColumns(prev =>
      prev.map(column =>
        column.id === id ? { ...column, locked: !column.locked } : column
      )
    );
  };

  const handleColorChange = (id: string, color: string) => {
    setColumns(prev => {
      const newColumns = prev.map(column => {
        if (column.id === id) {
          return { ...column, color };
        }
        if (!column.locked) {
          if (column.id === 'light' && id === 'base') {
            return { ...column, color: hslToString(getLighterShade(hexToHSL(color))) };
          }
          if (column.id === 'dark' && id === 'base') {
            return { ...column, color: hslToString(getDarkerShade(hexToHSL(color))) };
          }
          if (column.id === 'complement' && id === 'base') {
            return { ...column, color: hslToString(getComplementaryColor(hexToHSL(color))) };
          }
        }
        return column;
      });
      return newColumns;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Générateur de Palette de Couleurs
          </h1>
          <p className="text-gray-600">
            Appuyez sur la barre d'espace pour générer une nouvelle palette.
            Cliquez sur les couleurs pour les modifier manuellement.
            Utilisez les icônes de verrou pour figer les couleurs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center">
          {columns.map(column => (
            <ColorColumnComponent
              key={column.id}
              column={column}
              onToggleLock={toggleLock}
              onColorChange={handleColorChange}
            />
          ))}
        </div>

        <button
          onClick={generateNewPalette}
          className="mt-12 mx-auto block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Générer une nouvelle palette
        </button>
      </div>
    </div>
  );
}

export default App;