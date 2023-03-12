# next13-stylus-config
Here is the `next.config.js` file to migrate from `@zeit/next-stylus`, which was used in next10, to the latest version.

## Installation

```
yarn add -D style-loader style-loader-ssr css-loader stylus-loader
```

## Globally import mixins and variables with the Stylus loader
```
{
    loader: 'stylus-loader',
    options: {
      stylusOptions: {
        resolveURL: true,
        import: ["nib", path.join(__dirname, "src/utils/styles/main.module.styl")],
        use: ["nib"]
      }
    }
},
```

## If you need import Stylus variables in JS

`:export {}` is not supported by `stulus-loader`, so you can't directly import variables from `.styl` to `.js` files.

### To imporove that:

1. Move your variables from `variables.styl` to `variables.js`:

```
// variables.styl

$var1 = #ffcc00;
$var2 = #000000;
$mqMobS = 'screen and (max-width: 580px)';

// variables.js

module.exports = {
    var1: '#ffcc00';
    var2: '#000000';
    //Don't forget to add double quotes for values that contains spaces;
    mqMobS: '"screen and (max-width: 580px)"';
}
```

2. Import your `variables.js` in `next.config.js` and parse it:
```
const variables = require('./variables');

const additionalData = Object
              .entries(variables)
              .map(([key, value]) => `$${key} = ${value};`)
              .join("\n");
```

3. Add `additionalData` to your `stylus-loader` config:

```
{
    loader: 'stylus-loader',
    options: {
      additionalData, // right here
      stylusOptions: {
        resolveURL: true,
        import: ["nib", path.join(__dirname, "src/utils/styles/main.module.styl")],
        use: ["nib"]
      }
    }
}
```

4. Use `variables.js` to import stylus variables in your JS files whereever you need.