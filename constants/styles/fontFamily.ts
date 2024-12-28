const { fontFamily } = require("tailwindcss/defaultTheme");
export const fontFamilyConfig = {
  sans: ["var(--font-sans)", ...fontFamily.sans],
};
