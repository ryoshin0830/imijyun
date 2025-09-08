module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }]
    ],
    plugins: [
      // Expo Router用のプラグイン
      'expo-router/babel',
      // React Native Reanimated (将来的に使用する可能性があるため)
      'react-native-reanimated/plugin'
    ],
  };
};