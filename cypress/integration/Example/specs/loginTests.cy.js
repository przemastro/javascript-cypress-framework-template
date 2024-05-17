const loginScreen = require('../screens/loginScreen');
const loginScreenElements = require('../elements/loginScreenElements');
const commonScreen = require('../screens/commonScreen');
const commonScreenElements = require('../elements/commonScreenElements');

const LoginScreen = new loginScreen();
const CommonScreen = new commonScreen();

describe('Login to the app', () => {
  before(() => {
    CommonScreen.maximizeApp();
  });
  it('user should be able to navigate via [Login] button', () => {
    LoginScreen.clickButton(cy.get(loginScreenElements.loginButton));
  });
  it('user should be able to validate login screen', () => {
    LoginScreen.takeScreenshot("loginScreen_actual");
    LoginScreen.compareScreenshots("../../../../cypress/integration/Example/expected/web/loginScreen_expected.png", "loginTests.cy.js/loginScreen_actual.png", "lessThan", 2000)
  });
});
