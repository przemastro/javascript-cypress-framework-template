
const util = require('util');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

Cypress.Commands.add('copyFile', (sourcePath, destinationPath) => {
  return cy.exec(`cp ${sourcePath} ${destinationPath}`).then(({ stderr, code }) => {
    if (code !== 0) {
      throw new Error(`File copy failed: ${stderr}`);
    }
  });
});

const sourcePath = 'cypress/integration/Example/expected/';
const destinationPath = 'cypress/screenshots/Example/specs/';

class CypressHelper {

  minimizeApp() {
    cy.window().then((win) => {
      win.close();
    });
  }

  maximizeApp() {
    cy.visit('/');
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  }

  scrollToElement(element) {
    element.scrollIntoView();
  }

  takeScreenshots(screenName1, screenName2, delay, element) {
    if (arguments.length === 3) {
        this.takeScreenshot(screenName1)
        cy.wait(delay);
        this.takeScreenshot(screenName2)
    } else if (arguments.length === 4) {
        this.takeScreenshot(screenName1, element)
        cy.wait(delay);
        this.takeScreenshot(screenName2, element)
    } else {
      console.error('Invalid number of arguments');
    }
  }

  takeScreenshot(screenName, element) {
      if (arguments.length === 1) {
          cy.screenshot(screenName, {overwrite: true, capture: 'viewport'});
      } else if (arguments.length === 2) {
          element.should('be.visible').then(($el) => {
             const rect = $el[0].getBoundingClientRect();
             cy.screenshot(screenName, {
               overwrite: true,
               capture: 'viewport',
               clip: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
             });
          });
      } else {
        console.error('Invalid number of arguments');
      }
  }

  takeScreenshotAndCopyFile(actualName, expectedName, delay = 2000) {
    cy.wait(delay)
    cy.screenshot(actualName, {
      overwrite: true,
      capture: 'viewport'
    });

    cy.copyFile(sourcePath+expectedName, destinationPath+expectedName)
      .then(() => {
        cy.log('File copied successfully.');
      })
  }

  compareScreenshots(screenName1, screenName2, sign, thresholdValue, thresholdValue2 = 0) {
    try {
          cy.readFile(`./cypress/screenshots/Example/specs/${screenName1}`, 'binary').then((img1) => {
          cy.readFile(`./cypress/screenshots/Example/specs/${screenName2}`, 'binary').then((img2) => {

          const img1Decoded = PNG.sync.read(Buffer.from(img1, 'binary'));
          const img2Decoded = PNG.sync.read(Buffer.from(img2, 'binary'));

          const width = img1Decoded.width;
          const height = img1Decoded.height;

          const diff = new PNG({ width, height });
          const numDiffPixels = pixelmatch(img1Decoded.data, img2Decoded.data, diff.data, width, height, { threshold: 0.1 });

          console.log(`Left: ${thresholdValue}`);
          console.log(`Right: ${thresholdValue2}`);
          console.log(`Number of different pixels: ${numDiffPixels}`);

          switch (sign) {
            case 'moreThan':
              if (numDiffPixels < thresholdValue) {
                cy.log('Image comparison failed: Too little differences.').then(() => {
                  throw new Error(`Image comparison failed: Too little differences. ${numDiffPixels}`);
                });
              } else {
                cy.log('Image comparison passed: Acceptable differences.');
              }
              break;
            case 'lessThan':
              if (numDiffPixels > thresholdValue) {
                cy.log('Image comparison failed: Too many differences.').then(() => {
                  throw new Error(`Image comparison failed: Too many differences. ${numDiffPixels}`);
                });
              } else {
                cy.log('Image comparison passed: Acceptable differences.');
              }
              break;
            case 'between':
              if (numDiffPixels > thresholdValue2 || numDiffPixels < thresholdValue) {
                cy.log('Image comparison failed: Outside the acceptable range.').then(() => {
                  throw new Error(`Image comparison failed: Outside the acceptable range. ${numDiffPixels}`);
                });
              } else {
                cy.log('Image comparison passed: Acceptable differences.');
              }
              break;
          }
        });
      });
    } catch (error) {
      cy.log('Error comparing screenshots:', error.message).then(() => {
        throw new Error('Error comparing screenshots:', error.message);
      });
    }
  }
}

module.exports = CypressHelper;
