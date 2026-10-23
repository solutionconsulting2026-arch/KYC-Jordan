/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shell-bg': '#2B2E35',
        'page-bg': '#EDEFF2',
        'card-bg': '#FFFFFF',
        'crm-text': '#1F2329',
        'crm-muted': '#5B616B',
        'crm-border': '#CFD3D8',
        'crm-link': '#1F5BD8',
        'stage-current': '#2F7BEA',
        'stage-done': '#DCF2E3',
        'stage-done-text': '#1E6B3A',
        'stage-locked': '#E9EBEE',
        'stage-locked-text': '#4A4F57',
        'pill-active': '#F5C518',
        'tab-active': '#1F2329',
        'status-ok-bg': '#DCF2E3',
        'status-ok-text': '#1E6B3A',
        'status-warn-bg': '#FEF0C7',
        'status-warn-text': '#93370D',
        'status-bad-bg': '#FEE4E2',
        'status-bad-text': '#A01C12',
        'status-neutral-bg': '#E6E9EE',
        'status-neutral-text': '#3F4650',
        'brand-pink': '#E6007A',
        'brand-blue': '#1877F2',
        'brand-lime': '#C6E025',
        'shell-dark': '#0D0E12',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pnb': '0 2px 8px -1px rgba(123, 16, 19, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'pnb-lg': '0 10px 25px -3px rgba(123, 16, 19, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
