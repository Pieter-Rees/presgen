import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        army: {
          dark: '#2d3a1f',
          green: '#556b2f',
          olive: '#6b8e23',
          khaki: '#c3b091',
          'khaki-light': '#f5deb3',
          tan: '#d2b48c',
          brown: '#8b4513',
          gold: '#daa520',
          'gold-light': '#ffd700',
          bronze: '#cd7f32',
        },
        camo: {
          dark: '#1a1f0f',
          green: '#3d4a2f',
          light: '#5a6b4a',
        },
      },
      backgroundImage: {
        'camo-pattern': 'repeating-linear-gradient(45deg, #1a1f0f 0px, #1a1f0f 10px, #3d4a2f 10px, #3d4a2f 20px, #5a6b4a 20px, #5a6b4a 30px)',
        'ribbon-gradient': 'linear-gradient(135deg, #daa520 0%, #cd7f32 50%, #daa520 100%)',
        'ribbon-red': 'linear-gradient(135deg, #8b0000 0%, #dc143c 50%, #8b0000 100%)',
        'ribbon-blue': 'linear-gradient(135deg, #00008b 0%, #4169e1 50%, #00008b 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

