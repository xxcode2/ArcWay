/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        arc: {
          bg: "#05070d",
          panel: "#0b0f1a",
          panel2: "#10162599",
          line: "#1e2536",
          blue: "#4d8ee9",
          cyan: "#5fbfff",
          violet: "#8b7bf0",
          green: "#3ddc97",
          text: "#e7e9f5",
          muted: "#8a90a8",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(95,191,255,0.45)",
        glowViolet: "0 0 40px -10px rgba(139,123,240,0.45)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        drift: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(30px,-20px) scale(1.08)" },
          "100%": { transform: "translate(0,0) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%,100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
