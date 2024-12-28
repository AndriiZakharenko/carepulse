import type { Config } from "tailwindcss";
import { colors } from "./constants/styles/colors";
import { container } from "./constants/styles/container";
import { backgroundImage } from "./constants/styles/backgroundImage";
import { keyFrames } from "./constants/styles//keyFrames";
import { animation } from "./constants/styles/animation";
import { fontFamilyConfig } from "./constants/styles/fontFamily";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container,
    extend: {
      colors,
      fontFamily: fontFamilyConfig,
      backgroundImage,
      keyFrames,
      animation,
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
