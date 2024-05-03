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

## Polyfills

| Package                               | Description                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `react-native-bignumber`              | Supply `bn.js` with C++ instead of JS                                                    |
| `@craftzdog/react-native-buffer`      | Supply node `Buffer` with C++                                                            |
| `react-native-blob-jsi-helper`        | Supply `Blob` arrayBuffers with C++.                                                     |
| `blob-polyfill.ts`                    | Supply `Blob.stream()` with C++. Add Uint8Array support for `Blob.constructor()` with JS |
| `react-native-quick-crypto`           | Supply the node `crypto` API with C++ OpenSSL                                            |
| `@peculiar/webcrypto`                 | Supply the `crypto.subtle` webcrypto API with `react-native-quick-crypto` C++ OpenSSL    |
| `event-target-polyfill`               | Supply `new EventTarget()` with JS                                                       |
| `realistic-structured-clone`          | Supply `global.structuredClone` with JS                                                  |
| `web-streams-polyfill`                | Supply `ReadableStream` `WritableStream` with JS                                         |
| `readable-stream`                     | Supply node `stream` with JS                                                             |
| `react-native-url-polyfill`           | Supply the web & node `new URL()` API with JS                                            |
| `text-encoding`                       | Supply `new TextDecoder()` with JS                                                       |
| `@azure/core-asynciterator-polyfill ` | Supply `AsyncIterator` with JS                                                           |

## Usage

Install this package along with the following peer packages:

```
yarn add @tbd54566975/web5-react-native-polyfills react-native-quick-crypto@^0.7.0-rc.2 @craftzdog/react-native-buffer react-native-bignumber react-native-blob-jsi-helper
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
            stream: 'readable-stream',
            buffer: '@craftzdog/react-native-buffer',
            'bn.js': 'react-native-bignumber',
          },
        },
      ],
    ],
  };
};
```
