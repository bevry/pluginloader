'use strict'

const { equal } = require('assert-helpers')
const joe = require('joe')
const PluginLoader = require('./')

let BasePlugin = null
try {
	BasePlugin = require('../test-fixtures/baseplugin.js')
}
catch (err) {
	console.log('BasePlugin not supported on current node version')
}

// Tests
joe.suite('pluginloader', function (suite, test) {
	if (BasePlugin) {
		console.log('skipping base plugin tests')
		test('directplugin', function () {
			PluginLoader.create({
				BasePlugin,
				pluginPath: require('path').resolve(__dirname, '..', 'test-fixtures', 'directplugin')
			}).create()
		})
		test('indirectplugin', function () {
			PluginLoader.create({
				BasePlugin,
				pluginPath: require('path').resolve(__dirname, '..', 'test-fixtures', 'indirectplugin')
			}).create()
		})
	}
})
