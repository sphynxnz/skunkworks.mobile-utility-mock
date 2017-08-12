/**
 * Cloned from https://github.com/carbonrobot/relish.
 * Original version worked in cucumber@1.0.0, but not in cucumber@2.3.1
 * Updated to work in latest version cucumber@2.3.1
 */

'use strict'

const {defineSupportCode} = require('cucumber')
const config = require('../config.js')

defineSupportCode(function ({ Before }) {
  /**
     * Sets up a hook to configure the base url for a scenario.
     * The key of which is a configuration value in the config.baseUrl section.
     *
     * Example
     * @baseUrl @baseUrl-examples
     * Scenario: An example scenario name
     */
  Before({tags: '@baseUrl'}, function (scenarioResult) {
    let tags = scenarioResult.scenario.feature.tags
    for (let i = 0; i < tags.length; i++) {
      const name = tags[i].name
      if (name.includes('baseUrl-')) {
        const value = name.split('-')[1]
        this.baseUrl = config.baseUrl[value]
        return
      }
    }
  })
})
