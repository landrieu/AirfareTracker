module.exports = {
    test:    /\.(css|scss|sass)$/,
  include: [/node_modules/],
  loaders: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
    },
    {
      loader: 'sass-loader',
    },
  ],
  }