/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(222.2, 47.4%, 11.2%)",

        // Primary (blue)
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },

        // Gold color palette
        gold: {
          DEFAULT: "#FFD700",
          50: "#FFF9DB",
          100: "#FFF3B0",
          200: "#FFE87D",
          300: "#FFDD4A",
          400: "#FFD21A",
          500: "#FFD700",
          600: "#E6C200",
          700: "#B39700",
          800: "#806C00",
          900: "#4D4100",
        },

        // Accent + UI colors
        accent: {
          DEFAULT: "#16A34A",
          600: "#15803D",
          700: "#166534",
        },
        ring: "hsl(215, 20.2%, 65.1%)",
        "ring-offset-background": "hsl(0, 0%, 100%)",
      },

      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};
