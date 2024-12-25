import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        subcolor: "var(--subcolor)",
        maincolor: "var(--maincolor)",
        deepmaincolor: "var(--deepmaincolor)",
        deepcolor: "var(--deepcolor)",
      },
    },
  },
  plugins: [],
} satisfies Config;
