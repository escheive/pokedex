module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      // Required for reanimated and in turn, drawer navigation
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            components: './components',
          }
        }
      ]
    ],
  };
};
