const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      
    },
    baseUrl: "https://teststoreforsouthafri.nextbasket.shop/",
    chromeWebSecurity: false,
    pageLoadTimeout: 60000,
    defaultCommandTimeout: 60000,
    experimentalMemoryManagement: true,
    
  },
});
