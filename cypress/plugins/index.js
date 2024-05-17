
module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--disable-gpu');
      return launchOptions
    }
  });
}

const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = (on, config) => {
    allureWriter(on, config);
    return config;
};



 
 