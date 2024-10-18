const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          minSize: 30000,
          maxSize: 300000, // Adjust to control chunk size
          minChunks: 1,
          maxAsyncRequests: 6, // Reduce number of async requests
          maxInitialRequests: 4,
          automaticNameDelimiter: '-',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
              priority: -10,
              reuseExistingChunk: true,
            },
          },
        };
      }
      return webpackConfig;
    },
  },
};
