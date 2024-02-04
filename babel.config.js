module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for reanimated and drawer navigation
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            components: './components',
            utils: './utils',
            assets: './assets',
            constants: './constants',
            app: './app',
            api: './api',
            contexts: './contexts'
          }
        }
      ]
    ],
  };
};
