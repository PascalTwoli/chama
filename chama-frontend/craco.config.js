const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find and update ESLint webpack plugin configuration
      const eslintPlugin = webpackConfig.plugins.find(
        plugin => plugin.constructor.name === 'ESLintPlugin'
      );
      
      if (eslintPlugin) {
        // Remove deprecated options that cause errors in newer ESLint versions
        delete eslintPlugin.options.extensions;
        delete eslintPlugin.options.resolvePluginsRelativeTo;
        
        // Set safe options for ESLint webpack plugin
        eslintPlugin.options = {
          ...eslintPlugin.options,
          eslintPath: require.resolve('eslint'),
          context: path.resolve(__dirname, 'src'),
          cache: true,
          cacheLocation: path.resolve(__dirname, 'node_modules/.cache/.eslintcache'),
          failOnError: false,
          failOnWarning: false,
        };
      }
      
      return webpackConfig;
    },
  },
};

