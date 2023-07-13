## Background

This package provides an opinionated set of polyfills to:

- enable web5 to work on react-native
- shim crypto libraries
- increased performance using C++ FFIs

## Benefits

- no custom setup needed to support web5 on react native
- no need for the webcrypto API in web5
- higher performance
- opinionated set of high quality libraries verified by TBD

## Usage

Install the native packages:

```
yarn add @tbd54566975/web5-react-native-polyfills react-native-quick-crypto @craftzdog/react-native-buffer react-native-bignumber react-native-quick-base64
```

Install pods:

```
npx pod-install@latest
```

Add the following code to your index.js entrypoint:

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
            stream: "stream-browserify",
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
