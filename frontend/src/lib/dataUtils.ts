import { colorPalettesForCookbook } from "../data/colorPalettesForCookbook";

export function getRandomColorPalette() {
  const index = Math.floor(Math.random() * colorPalettesForCookbook.length);
  return colorPalettesForCookbook[index];
}