/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#251b25",
        plum: { DEFAULT: "#3a313b", soft: "#4d4350" },
        paper: "#faf8f6",
        mist: "#f2eef1",
        line: "#e6e0e5",
        muted: "#675c68",
        brass: { DEFAULT: "#c9a46a", deep: "#7d5d27" },
        ok: { DEFAULT: "#2b7a57", soft: "#e6f3ec" },
        tight: { DEFAULT: "#946100", soft: "#fbf1d9" },
        modify: { DEFAULT: "#ac4a1c", soft: "#fbe9df" },
        no: { DEFAULT: "#ae2a22", soft: "#fbe5e3" },
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', "Palatino", '"Book Antiqua"', "Georgia", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      borderRadius: { card: "1rem" },
      boxShadow: {
        soft: "0 1px 2px rgb(37 27 37 / 0.05), 0 8px 24px -12px rgb(37 27 37 / 0.14)",
        lift: "0 2px 4px rgb(37 27 37 / 0.06), 0 18px 40px -16px rgb(37 27 37 / 0.28)",
      },
    },
  },
  plugins: [],
};
export default config;
