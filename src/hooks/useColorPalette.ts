import { useState, useCallback } from 'react';
import { ColorColumn } from '../types/colors';
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
} from '../utils/colorUtils';

export function useColorPalette() {
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

  const generateDerivedColors = useCallback((baseColor: string, columns: ColorColumn[]) => {
    const baseHSL = hexToHSL(baseColor);
    const updatedColumns = [...columns];

    // Mettre à jour les couleurs dérivées si elles ne sont pas verrouillées
    updatedColumns.forEach(column => {
      if (column.locked) return;

      switch (column.id) {
        case 'light':
          column.color = hslToString(getLighterShade(baseHSL));
          break;
        case 'dark':
          column.color = hslToString(getDarkerShade(baseHSL));
          break;
        case 'complement':
          column.color = hslToString(getComplementaryColor(baseHSL));
          break;
      }
    });

    return updatedColumns;
  }, []);

  const generateNewPalette = useCallback(() => {
    setColumns(prev => {
      let newColumns = [...prev];
      const baseColumn = newColumns.find(col => col.id === 'base')!;

      // Générer une nouvelle couleur de base si elle n'est pas verrouillée
      if (!baseColumn.locked) {
        const newBaseColor = generateRandomHSLColor();
        baseColumn.color = hslToString(newBaseColor);
      }

      // Mettre à jour les couleurs dérivées en fonction de la couleur de base
      newColumns = generateDerivedColors(baseColumn.color, newColumns);

      // Générer de nouvelles couleurs indépendantes si elles ne sont pas verrouillées
      newColumns.forEach(column => {
        if (column.locked) return;

        switch (column.id) {
          case 'pureWhite':
            column.color = hslToString(generateRandomWhite());
            break;
          case 'offWhite':
            column.color = hslToString(generateOffWhite());
            break;
          case 'titleBlack':
            column.color = hslToString(generateTitleBlack());
            break;
          case 'paragraphBlack':
            column.color = hslToString(generateParagraphBlack());
            break;
        }
      });

      return newColumns;
    });
  }, [generateDerivedColors]);

  const toggleLock = useCallback((id: string) => {
    setColumns(prev => prev.map(column => 
      column.id === id ? { ...column, locked: !column.locked } : column
    ));
  }, []);

  const handleColorChange = useCallback((id: string, color: string) => {
    setColumns(prev => {
      let newColumns = [...prev];
      const column = newColumns.find(col => col.id === id)!;
      column.color = color;

      // Si la couleur de base change, mettre à jour les couleurs dérivées
      if (id === 'base') {
        newColumns = generateDerivedColors(color, newColumns);
      }

      return newColumns;
    });
  }, [generateDerivedColors]);

  return {
    columns,
    generateNewPalette,
    toggleLock,
    handleColorChange,
  };
}