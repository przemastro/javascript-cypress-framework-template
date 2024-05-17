const commonScreenElements = require('../elements/commonScreenElements');
const commonScreen = require('../screens/commonScreen');
const loginScreenElements = require('../elements/accountScreenElements');
const CypressHelper = require('../utils/cypressHelper');

const config = require('../config.json');
const email = config.email;
const password = config.password;

class CommonScreen extends CypressHelper {

  clickButton(element) {
    element.should('be.visible').click();
  }

  doubleClickButton(element) {
    element.should('be.visible').dblclick();
  }

  enterValue(element, value) {
    element.should('be.visible').click().type(value);
  }

  verifyElementExists(element, options = {}) {
    element.should("be.visible").then(() => {
           console.log("Element is visible");
    });
  }

  verifyElementNotExists(element) {
    cy.wait(2000);

    cy.wrap({ attempts: 0 }).should(() => {
      const isDisplayed = element.is(':visible');
      if (!isDisplayed) {
      }
      throw new Error('Element unexpectedly displayed');
    }, { timeout: 5000, interval: 500 });
  }

  verifyElementVisibility(element, maxAttempts = 20, interval = 500) {
    cy.wait(2000);

    cy.wrap({ attempts: 0 }).should(() => {
      const isDisplayed = element.is(':visible');
      if (isDisplayed) {
        return true;
      }
      throw new Error('Element not visible yet');
    }, { timeout: maxAttempts * interval, interval });
  }

  verifyElementDoesNotExist(element) {
    element.should('not.exist');
  }
}

module.exports = CommonScreen;