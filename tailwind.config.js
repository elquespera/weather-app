/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        "max-app": "768px",
        tab: "8em",
        "full-mobile": "min(100vw, 640px)",
      },

      height: {
        header: "6rem",
      },

      spacing: {
        header: "6rem",
        app: "1.5rem",
        "app-lg": "2rem",
      },

      keyframes: {
        appear: {
          "0%": { transform: "scale(80%)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        rotate: {
          "100%": { transform: "rotate(0)" },
        },
        "spinner-appear": {
          "0%": { transform: "scale(0)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "spinner-disappear": {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0)", opacity: 0 },
        },
      },

      animation: {
        "spin-fast":
          "spin 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) infinite",
        appear: "appear 0.2s cubic-bezier(0.550, 0.085, 0.680, 0.530) forwards",
        rotate:
          "rotate 0.2s cubic-bezier(0.550, 0.085, 0.680, 0.530) 0.2s forwards",
        "spinner-appear":
          "spinner-appear 0.2s cubic-bezier(0.550, 0.085, 0.680, 0.530) forwards",
        "spinner-disappear":
          "spinner-disappear 0.2s cubic-bezier(0.550, 0.085, 0.680, 0.530) forwards",
      },

      boxShadow: {
        spinner: "rgba(0, 0, 0, 0.24) 0px 2px 8px",
      },

      translate: {
        "tab-offset": "var(--wapp-tab-offset)",
        "button-group-offset": "var(--wapp-button-group-offset)",
      },

      colors: {
        primary: {
          DEFAULT: "var(--color-primary-600)",
          light: "var(--color-primary-300)",
          dark: "var(--color-primary-800)",
          header: "var(--color-primary-header)",
          "sub-header": "var(--color-primary-subheader)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          disabled: "var(--color-text-disabled)",
          secondary: "var(--color-text-secondary)",
          contrast: "var(--color-text-contrast)",
        },

        divider: {
          DEFAULT: "var(--color-divider)",
        },

        background: {
          DEFAULT: "var(--color-background)",
        },

        switch: {
          DEFAULT: "var(--color-checked)",
          unchecked: "var(--color-unchecked)",
          knob: "var(--color-switch-knob)",
        },
      },
    },
  },
  plugins: [],
};
