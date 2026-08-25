/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        'primary-light': '#2A4F7F',
        'route-west': '#E67E22',       // 暖橙 — 西部/沙漠/科学精神
        'route-west-light': '#F39C12',
        accent: '#F59E0B',
        bg: '#F8FAFC',
        'text-main': '#1E293B',
        'text-secondary': '#64748B',
        // ECC Vintage Editorial / Paper & Ink 辅助色（暖棕叙事调）
        sand: '#F5EBDC',               // 沙色底 — 呼应戈壁/纸张质感
        dust: '#C89B6D',               // 尘土棕 — dusty warm 强调
        ink: '#2B2B2B',                // 墨色 — editorial 深色
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        // 衬线叙事标题 — 呼应「一条路，两代人」的文学感
        serif: ['"Noto Serif SC"', '"Songti SC"', 'SimSun', 'STSong', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
