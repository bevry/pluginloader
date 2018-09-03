'use strict'

const { errorEqual } = require('assert-helpers')
const joe = require('joe')
const PluginLoader = require('./')


// Tests
joe.suite('pluginloader', function (suite) {
	suite('memory', function (suite, test) {
		class BasePlugin {
			constructor () {
				console.log('hello from base plugin')
			}
		}
		class ManualPlugin extends BasePlugin {
			get name () {
				return 'manualplugin'
			}
			constructor (...args) {
				super(...args)
				console.log('hello from manual plugin')
			}
		}
		test('manual', function () {
			PluginLoader.create({
				packageData: {
					name: 'manualplugin'
				},
				BasePlugin,
				PluginClass: ManualPlugin
			}).create()
		})
		test('name-failure', function () {
			try {
				PluginLoader.create({
					packageData: {
						name: 'inconsistent'
					},
					BasePlugin,
					PluginClass: ManualPlugin
				}).create()
				throw new Error('should not have reached here')
			}
			catch (err) {
				errorEqual(err.stack.toString(), 'must match the specified name of')
			}
		})
		suite('prefix', function (suite, test) {
			test('success', function () {
				PluginLoader.create({
					prefix: 'my-',
					packageData: {
						name: 'my-manualplugin'
					},
					BasePlugin,
					PluginClass: ManualPlugin
				}).create()
			})
			test('failure', function () {
				try {
					PluginLoader.create({
						prefix: 'our-',
						packageData: {
							name: 'my-manualplugin'
						},
						BasePlugin,
						PluginClass: ManualPlugin
					})
					throw new Error('should not have reached here')
				}
				catch (err) {
					errorEqual(err, 'prefix')
				}
			})
		})
	})
	suite('file', function (suite, test) {
		// load local file
		let BasePlugin = null
		try {
			BasePlugin = require('../test-fixtures/baseplugin.js')
		}
		catch (err) {
			console.log('BasePlugin not supported on current node version')
		}

		// test local file
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
})
