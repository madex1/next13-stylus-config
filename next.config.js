const path = require('path');
const variables = require('./src/utils/styles/variables');

//if you
const additionalData = Object
              .entries(variables)
              .map(([key, value]) => `$${key} = ${value};`)
              .join("\n");

module.exports = {
  cssModules: true,
  webpack: (config, {isServer}) => {
    config.module.rules.push(
        {
          
          test: /\.styl$/,
          use: [
            /* style-loader not working with SSR */
            {
              loader: isServer ? 'style-loader-ssr' : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                importLoaders: 2,
                modules: {
                  localIdentName: '[local]___[hash:base64:5]',
                  exportLocalsConvention: "camelCase"
                },
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                additionalData, // if you need to import variables to js
                stylusOptions: {
                  /* here is your stylus-loader config */
                  resolveURL: true,
                  import: ["nib", path.join(__dirname, "src/utils/styles/main.module.styl")],
                  use: ["nib"]
                }
              }
            },
          ]
        }
    )

    return config;
  }
}