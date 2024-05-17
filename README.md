# javascript-cypress

## Cypress
### Install
If missing please install following on your machine (MacOS):

     > brew install node@(version number)
     > brew install allure@(version number)
     > npm install
     > npm install sharp

My configuration: node(v14.21.3), npm(6.14.18), allure(2.24.1), cypress(9.7.0)

### Update cypress.json
Example url:

     "baseUrl": "",

### Update config.json with appropriate credentials

### Run Tests
From the main folder

      > npm run webTests

If you don't want to run all test suite, then change in package.json file following line e.g. "webTests": "npx cypress run --spec 'cypress/integration/Example/specs/loginTests.cy.js' --env allure=true",

### Generate Allure Report

After tests are executed results should be generated in /allure-results folder. Run following command to open the report

      > allure serve
