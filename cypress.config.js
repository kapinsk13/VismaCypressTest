const { defineConfig } = require("cypress");

module.exports = defineConfig({
  "watchForFileChanges": false,
  e2e: {

    env: {
            baseUrl: 'https://omega-vismatestingapp.azurewebsites.net',
        },
  },
});
