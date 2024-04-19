## Background

This package provides an opinionated set of polyfills to:

- enable web5 to work on react-native with no custom setup
- increase performance using C++ native libraries similar to what underpins Node and Browser

### Pitch

Use this package if:

- You're just getting started.
- You want to get up and running quickly on react native and don't want to spend time perfectly tweaking all of your globals and polyfills.

### Anti-pitch

Don't use this package if:

- You want to perfectly understand the global namespace and everything that's going on with your RN runtime and JS engine.
- You prefer to self manage the versions of all of these dependencies.
- You don't want us to version these dependencies for you.

## Usage

Install the polyfill package and the native packages:

```
yarn add @tbd54566975/web5-react-native-polyfills react-native-quick-crypto @craftzdog/react-native-buffer react-native-bignumber react-native-quick-base64
```

Add the following code to the top of your index.js entrypoint:

```js
import '@tbd54566975/web5-react-native-polyfills';
```

Add the following two entries inside the `plugins` key of your babel.config.js:

```js
["@babel/plugin-proposal-private-methods", { loose: true }],
      [
        "module-resolver",
        {
          alias: {
            crypto: "react-native-quick-crypto",
            stream: "readable-stream",
            buffer: "@craftzdog/react-native-buffer",
            "bn.js": "react-native-bignumber",
          },
        },
      ],
```

For example (Expo):

```js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      [
        'module-resolver',
        {
          alias: {
            crypto: 'react-native-quick-crypto',
            stream: 'stream-browserify',
            buffer: '@craftzdog/react-native-buffer',
            'bn.js': 'react-native-bignumber',
          },
        },
      ],
    ],
  };
};
```
