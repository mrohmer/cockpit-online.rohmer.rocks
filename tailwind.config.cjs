/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff9a5a',
        background: '#2a2b2d',
        'slot-1': '#a31b21',
        'slot-2': '#3865ab',
        'slot-3': '#25c57f',
        'slot-4': '#e8d43c',
        'slot-5': '#ced3d0',
        'slot-6': '#141414',
      },
    }
  },
  plugins: [
    ({ addBase, theme }) => {
      const extractColorVars = (colorObj, colorGroup = '') => {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      };

      addBase({
        ':root': extractColorVars(theme('colors'))
      });
    }
  ],
}
