// H&H Donations Brand Colors
export const brandColors = [
  "#edfdf9", // 0 - Lightest mint
  "#dbf8f1", // 1 - Very light mint
  "#b1f2e1", // 2 - Light mint
  "#85ecd1", // 3 - Medium light mint
  "#64e7c3", // 4 - Medium mint
  "#51e4ba", // 5 - Medium mint
  "#46e3b6", // 6 - Medium dark mint
  "#39c99f", // 7 - Dark mint
  "#2cb38d", // 8 - Darker mint
  "#094c3b"  // 9 - Darkest mint (primary dark)
];

// Color aliases for semantic usage
export const colors = {
  // Background colors
  lightest: brandColors[0],     // #edfdf9
  veryLight: brandColors[1],    // #dbf8f1
  light: brandColors[2],        // #b1f2e1
  
  // Accent colors
  accent: brandColors[3],       // #85ecd1
  accentMedium: brandColors[4], // #64e7c3
  accentDark: brandColors[5],   // #51e4ba
  
  // Primary colors
  primary: brandColors[6],      // #46e3b6
  primaryMedium: brandColors[7], // #39c99f
  primaryDark: brandColors[8],   // #2cb38d
  primaryDarkest: brandColors[9] // #094c3b
};

// CSS variables object
export const cssVariables = {
  '--hh-lightest': colors.lightest,
  '--hh-very-light': colors.veryLight,
  '--hh-light': colors.light,
  '--hh-accent': colors.accent,
  '--hh-accent-medium': colors.accentMedium,
  '--hh-accent-dark': colors.accentDark,
  '--hh-primary': colors.primary,
  '--hh-primary-medium': colors.primaryMedium,
  '--hh-primary-dark': colors.primaryDark,
  '--hh-primary-darkest': colors.primaryDarkest
};