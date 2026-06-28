/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Enough brand palette: serious, trustworthy, Singapore-retirement focused.
        enough: {
          navy: "#0A2540", // primary deep navy
          navyLight: "#163A61", // hover / secondary navy
          blue: "#1B6FA8", // accent blue
          emerald: "#0E9F6E", // SAFE / success
          emeraldDark: "#0B7A55",
          amber: "#D97706", // WARNING / caution
          amberSoft: "#FCEFD6",
          red: "#DC2626", // DANGER / over-aggressive
          redSoft: "#FBE3E3",
          cream: "#F6F4EF", // app background
          paper: "#FFFFFF",
          ink: "#0F1B2D", // primary text
          slate: "#5B6B7F", // secondary text
          line: "#E2E6EC", // borders
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        // Deliberately large for retiree / family readability.
        base: ["1.0625rem", { lineHeight: "1.7rem" }],
        lg: ["1.15rem", { lineHeight: "1.8rem" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,37,64,0.04), 0 8px 24px rgba(10,37,64,0.06)",
        pop: "0 2px 6px rgba(10,37,64,0.08), 0 16px 40px rgba(10,37,64,0.10)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      maxWidth: {
        app: "1120px",
      },
    },
  },
  plugins: [],
};
