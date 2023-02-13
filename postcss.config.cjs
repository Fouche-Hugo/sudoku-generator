// @ts-nocheck
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env')({ stage: 1 }),
    require('cssnano'),
    require('autoprefixer'),
  ],
}
