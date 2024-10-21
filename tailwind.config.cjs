module.exports = {
  content: ['./index.html','./**/*.html', './src/**/*.vue', './src/**/**/*.vue'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'standalone': {raw: "(display-mode: standalone)"},
      },
      height: {
        '80': '5rem',
        '85': '5.313rem',
        '52vh': '52vh',
        '60vh': '60vh',
        '78vh': '78vh',
        '85vh': '85vh'
      },
      minHeight: {
        'chat': '90vh'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    // styled: true,
    // themes: [
    //   'dark',
    //   'light',
    //   'cupcake',
    //   'bumblebee', // first one will be the default theme
    //   'forest',
    //   'synthwave'
    // ],
    // base: true,
    // utils: true,
    // rtl: false,
    logs: false,
  },
}
