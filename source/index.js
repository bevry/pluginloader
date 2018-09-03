'use strict'

// Standard
const pathUtil = require('path')

// External
const Errlop = require('errlop')
const semver = require('semver')

// Local
const alphanumeric = /^[a-z0-9]+$/

/**
 * Check the speified versions against the specified ranges
 * @param {Object<string, string>} versions
 * @param {Object<string, string>} ranges
 * @param {string} group
 * @returns {Array<Errlop>}
 * @private
 */
function checkVersions (versions, ranges, group) {
	const errors = []
	if (ranges) {
		for (const thing in versions) {
			if (versions.hasOwnProperty(thing)) {
				// the .replace is to support version flags, such as -beta
				const version = versions[thing].replace(/-.+/, '')
				const range = ranges[thing]
				if (range && semver.satisfies(version, range) === false) {
					errors.push(new Errlop(
						`${group} [${thing} = ${range}] unsupported by plugin's range [${range}]`
					))
				}
			}
		}
	}
	return errors
}

/**
 * @typedef {Object} PluginLoaderOptions
 * @property {string} [keyword]
 * @property {string} [prefix]
 * @property {Object<string, string>?} [versions]
 * @property {string} pluginPath
 * @property {BasePlugin} BasePlugin
 * @property {BasePlugin} PluginClass
 */

/**
 * The Plugin Loader class
 * @param {PluginLoaderOptions} opts
 */
class PluginLoader {
	constructor (opts) {
		/**
		 * A keyword, that if specified, will need to be specified by the plugin in order to be loaded
		 * @type {string?}
		 */
		this.keyword = opts.keyword

		/**
		 * A prefix, that if specified, will need commence the plugin's package name
		 * @type {string?}
		 */
		this.prefix = opts.prefix

		/**
		 * A version map, that if specified, will need to be supported by the plugin's peer dependencies in order to be loaded
		 * @type {Object<string, string>?}
		 */
		this.versions = opts.versions || {}

		/**
		 * The Base Plugin Class
		 * @type {BasePlugin}
		 */
		this.BasePlugin = opts.BasePlugin

		/**
		 * The absolute path to the plugin's directory
		 * @type {string}
		 */
		this.pluginPath = opts.pluginPath

		/**
		 * The path to the plugin's package.json file
		 * @type {string}
		 */
		this.packagePath = pathUtil.resolve(this.pluginPath, 'package.json')

		/**
		 * The parsed contents of the plugin's package.json file
		 * @type {string}
		 */
		this.packageData = require(this.packagePath)
		if (!this.packageData.keywords) this.packageData.keywords = []
		if (!this.packageData.platforms) this.packageData.platforms = []
		if (!this.packageData.engines) this.packageData.engines = {}
		if (!this.packageData.peerDependencies) this.packageData.peerDependencies = {}
		// Validate
		if (!this.packageData.name) {
			throw new Errlop(`Plugin's package.json [${this.packagePath}] is missing a "name" field`)
		}
		if (!this.packageData.version) {
			throw new Errlop(`Plugin's package.json [${this.packagePath}] is missing a "version" field`)
		}

		/**
		 * The plugin's name. Must be alphanumeric.
		 * If not specified, defaults to the basename of the plugin path, with the prefix removed.
		 * @type {string}
		 */
		this.pluginName = this.packageData.name
		if (this.prefix) {
			if (this.pluginName.startsWith(this.prefix)) {
				this.pluginName = this.pluginName.substr(this.prefix.length)
			}
			else {
				throw new Errlop(`Plugin's package.json [${this.packagePath}] does not start with the required prefix [${this.prefix}]`)
			}
		}
		if (alphanumeric.test(this.pluginName) === false) {
			throw new Errlop(`Plugin's name must be alphanumeric: ${this.pluginName}`)
		}

		/**
		 * The version of the plugin
		 * @type {string}
		 */
		this.pluginVersion = this.packageData.version

		/**
		 * The path to the plugin's main file
		 * @type {string}
		 */
		this.pluginMainPath = pathUtil.resolve(this.pluginPath, this.packageData.main)

		/**
		 * The Base Plugin Class
		 * @type {BasePlugin}
		 */
		this.PluginClass = null
		if (opts.PluginClass) {
			if (this.isPluginClass(opts.PluginClass) === false) {
				throw this.error('The specified PluginClass did not inherit from the specified BasePlugin.')
			}
			this.PluginClass = opts.PluginClass
		}
		else {
			const direct = require(this.pluginMainPath)
			if (this.isPluginClass(direct)) {
				// module.exports = class MyPlugin extends require('...-baseplugin') {}
				this.PluginClass = direct
			}
			else {
				// module.exports = (BasePlugin) -> class MyPlugin extends BasePlugin {}
				const indirect = direct(this.BasePlugin)
				if (this.isPluginClass(indirect)) {
					this.PluginClass = indirect
				}
				else {
					throw this.error(`The resolved PluginClass from [${this.pluginMainPath}] did not inherit from the specified BasePlugin.`)
				}
			}
		}

		// Validate
		this.validate()
	}

	/**
	 * Check if this plugin is supported
	 * @returns {boolean} supported
	 * @throws {Errlop} supported failure reason
	 * @private
	 */
	validate () {
		const { keywords, platforms, engines, peerDependencies } = this.packageData
		const errors = []

		if (this.keyword && keywords.includes(this.keyword) === false) {
			errors.push(new Errlop(
				`keyword [${this.keyword}] missing from the plugin's keywords [${keywords.join(', ')}]`
			))
		}
		if (platforms.length && platforms.includes(process.platform) === false) {
			errors.push(new Errlop(
				`platform [${process.platform}] unsupported by plugin's engines [${platforms.join(', ')}]`
			))
		}
		if (engines) {
			errors.push(...checkVersions(process.versions, engines, 'engine'))
		}
		if (peerDependencies) {
			errors.push(...checkVersions(this.versions, peerDependencies, 'peer dependency'))
		}

		if (errors.length) {
			throw new Errlop(
				`Plugin [${this.pluginPath}] is unsupported.`,
				errors.length === 1 ? errors[0] : new Errlop(errors.map((error) => error.stack).join('\n'))
			)
		}

		return true
	}

	/**
	 * Does the passed class inherit from the BasePlugin?
	 * @param {BasePlugin} klass
	 * @returns {boolean}
	 * @protected
	 */
	isPluginClass (klass) {
		while (klass) {
			if (klass === this.BasePlugin || klass instanceof this.BasePlugin) {
				return true
			}
			klass = klass.prototype
		}
		return false
	}

	/**
	 * Helper for creating Errlop instances against the plugin.
	 * @param {string} message
	 * @param {Error} parent
	 * @returns {Errlop}
	 * @protected
	 */
	error (message, parent) {
		return new Errlop(
			message + '\nPlugin: ' + this.pluginPath,
			parent
		)
	}

	/**
	 * Instantiate the {@link PluginLoader#PluginClass} with the arguments
	 * @param {...*} arguments to forward to the plugin class constructor
	 * @returns {BasePlugin} the instantiation result
	 * @throws {Errlop} instantiation failure reason
	 */
	create (...args) {
		try {
			const plugin = new (this.PluginClass)(...args)

			// ensure name and version are correct
			if (plugin.name) {
				if (plugin.name !== this.pluginName) {
					throw new Error(`Plugin instance's "name" [${plugin.name}] did not match the expectation of [${this.pluginName}]`)
				}
			}
			else {
				plugin.name = this.pluginName
			}
		}
		catch (err) {
			throw new Errlop(`Plugin [${this.pluginPath}] failed to instantiate.`, err)
		}
	}

	/**
	 * Alternative means for creating a {@link PluginLoader} instance.
	 * @static
	 * @param  {...*} args - forwarded to the constructor
	 * @returns {PluginLoader}
	 */
	static create (...args) {
		return new this(...args)
	}

}

module.exports = PluginLoader
