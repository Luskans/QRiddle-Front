/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  purge: {
    safelist: [
      'bg-red-200',
      'bg-red-300',
      'bg-red-400',
      'border-red-400',
      'border-red-500',
      'dark:bg-red-200',
      'dark:bg-red-300',
      'dark:bg-red-400',
      'px-1',
      'px-2',
      'px-3',
      'py-1',
      'py-1.5',
      'py-2',
      'py-3',
    ],
  },
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        abel: ['Abel'],
        cabin: ['Cabin'],
        lexend: ['Lexend'],
        mulish: ['Mulish'],
        nunito: ['Nunito'],
        playfair: ['Playfair'],
        rubikdirt: ['RubikDirt'],
        satisfy: ['Satisfy'],
        synemono: ['SyneMono'],
        sub: ['Synemono'],
        h: ['RubikDirt'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '40px', fontWeight: '400' }],
        'h2': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'p': ['16px', { lineHeight: '24px' }],
        'small': ['14px', { lineHeight: '20px' }],
      },
      colors: {
        primary: {
          mid: '#ebad7f',
          lighter: '#ffcfa0', //#cda88e
          darker: '#8E684D' //#7e5226 #ab8763 #9c5f32
        },
        secondary: {
          mid: '#6d65ba',
          lighter: '#c2bdff',
          darker: '#6960CB' //#584EC3 #574fab
        },
        white: "#ffffff",
        light: "#f9f9f9",
        dark: "#333333", //1b1b1b
        gray: {
          mid: '#828282',
          lighter: '#c2c2c2',
          darker: '#444444'
        },
        gradientPrimary: ['#dbb68c', '#ffe1bf'],
        gradientSecondary: ['#6d65ba', '#9b93e6']
      },
    },
  },
  plugins: [],
};
