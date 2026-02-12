import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      sm: "0.750rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.75rem",
      "3xl": "2.25rem",
      "4xl": "3.5rem",
      "5xl": "4.5rem",
    },
    fontFamily: {
      heading: [`var(--font-jersey)`],
      body: [`var(--font-cuprum)`],
    },
    extend: {
      transitionProperty: {
        height: "height",
      },
      colors: {
        text: {
          DEFAULT: "var(--text)",
          highlight: "var(--text-highlight)",
        },
        background: "var(--background)",
        primary: {
          DEFAULT: "var(--primary)",
          highlight: "var(--primary-highlight)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          highlight: "var(--secondary-highlight)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          highlight: "var(--accent-highlight)",
        },
        white: "#fff",
        black: "#000",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
export default config;
