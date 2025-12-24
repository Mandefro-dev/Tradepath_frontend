// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode:"class",
 theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#0ea5e9', // sky-500
          'hover': '#0284c7', // sky-600
        },
        'success': '#22c55e', // green-500
        'danger': '#ef4444',  // red-500
        
        'dark': {
          950: '#0B1120', // Main Background
          900: '#111827', // Lighter Background (Cards)
          800: '#1F2937', // Surface
          700: '#374151', // Border, Muted Elements
        },
        
        'light': {
          DEFAULT: '#f1f5f9', // slate-100
          'medium': '#94a3b8',// slate-400
          'muted': '#64748b',   // slate-500
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'aurora': 'aurora 60s linear infinite',
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: '0% 50%' },
          to: { backgroundPosition: '200% 50%' },
        }
      }
    }},
  plugins: [
    require('@tailwindcss/forms'), 
  ],
};
















// /** @type {import('tailwindcss').Config} */
// export default {
//     content: [
//       "./index.html",
//       "./src/**/*.{js,ts,jsx,tsx}",
//     ],
//     darkMode: 'class', // Or 'media' if you prefer OS setting
//     theme: {
//       extend: {
//         colors: {
//             'tp-primary': '#0ea5e9', // sky-500
//             'tp-primary-hover': '#0284c7', // sky-600
//             'tp-primary-light': '#38bdf8', // sky-400
//             'tp-secondary': '#64748b', // slate-500
    
//             'tp-bg-dark': '#0B1120',    // Very dark blue/slate, darker than slate-900
//             'tp-bg-light': '#1E293B',   // slate-800
//             'tp-surface': '#334155',  // slate-700
//             'tp-surface-light': '#475569', // slate-600
    
//             'tp-text-primary': '#f1f5f9', // slate-100 (brighter for dark theme)
//             'tp-text-secondary': '#94a3b8',// slate-400
//             'tp-text-muted': '#64748b',   // slate-500
    
//             'tp-border': '#3e4c5f',     // Between slate-600 and slate-700
//             'tp-success': '#22c55e',   // green-500
//             'tp-error': '#ef4444',     // red-500
//             'tp-warning': '#f59e0b',   // amber-500
//             'tp-info': '#3b82f6',      // blue-500
//             'tp-bg-dark': {
//         DEFAULT: '#1a1a1a'  // replace with your actual color
//       }

//           },
//           fontFamily: {
//             sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
//           },  borderRadius: {
//             'md': '0.375rem', // 6px
//             'lg': '0.5rem',   // 8px
//             'xl': '0.75rem',  // 12px
//           },  boxShadow: {
//             'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//             'card': '0 4px 12px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
//             'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//           }
//       },
//     },
//     plugins: [],
//   }