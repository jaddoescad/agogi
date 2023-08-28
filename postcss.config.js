module.exports = {
  plugins: {
    // post css init
    'postcss-import': {},
    'postcss-nested': {},  // Placed before tailwindcss
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-simple-vars': {}
  }
};
