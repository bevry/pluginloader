import * as pathUtil from 'path'
import { errorEqual } from 'assert-helpers'
import kava from 'kava'
import PluginLoader from './index.js'
import BasePlugin from '../test-fixtures/baseplugin.js'

// Tests
kava.suite('pluginloader', function (suite) {
	suite('memory', function (suite, test) {
		class BasePlugin {
			constructor() {
				console.log('hello from base plugin')
			}
		}
		class ManualPlugin extends BasePlugin {
			get name() {
				return 'manualplugin'
			}
			constructor() {
				super()
				console.log('hello from manual plugin')
			}
		}
		test('manual', function () {
			PluginLoader.create({
				packageData: {
					name: 'manualplugin',
				},
				BasePlugin,
				PluginClass: ManualPlugin,
			}).create()
		})
		test('name-failure', function () {
			try {
				PluginLoader.create({
					packageData: {
						name: 'inconsistent',
					},
					BasePlugin,
					PluginClass: ManualPlugin,
				}).create()
				throw new Error('should not have reached here')
			} catch (err) {
				errorEqual(err.stack.toString(), 'must match the specified name of')
			}
		})
		suite('prefix', function (suite, test) {
			test('success', function () {
				PluginLoader.create({
					prefix: 'my-',
					packageData: {
						name: 'my-manualplugin',
					},
					BasePlugin,
					PluginClass: ManualPlugin,
				}).create()
			})
			test('failure', function () {
				try {
					PluginLoader.create({
						prefix: 'our-',
						packageData: {
							name: 'my-manualplugin',
						},
						BasePlugin,
						PluginClass: ManualPlugin,
					})
					throw new Error('should not have reached here')
				} catch (err) {
					errorEqual(err, 'prefix')
				}
			})
		})
	})
	suite('file', function (suite, test) {
		// test local file
		console.log('skipping base plugin tests')
		test('directplugin', function () {
			PluginLoader.create({
				BasePlugin,
				pluginPath: pathUtil.resolve(
					__dirname,
					'..',
					'test-fixtures',
					'directplugin'
				),
			}).create()
		})
		test('indirectplugin', function () {
			PluginLoader.create({
				BasePlugin,
				pluginPath: pathUtil.resolve(
					__dirname,
					'..',
					'test-fixtures',
					'indirectplugin'
				),
			}).create()
		})
	})
})
