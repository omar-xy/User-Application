import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Ensure all src files are scanned
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "#0D0D0D", // Dark void
        neonPink: "#FF007F",   // Vibrant pink
        neonCyan: "#00FFFF",   // Electric cyan
        neonPurple: "#9D00FF", // Deep neon purple
        glow: "#E0E0FF",       // Soft glowing white
      },
    },
  },
  plugins: [],
} satisfies Config;