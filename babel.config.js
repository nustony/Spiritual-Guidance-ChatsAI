module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env', // Default module name for imports
          path: '.env',       // Path to the environment variables file
        },
      ],
    ],
  };
};
