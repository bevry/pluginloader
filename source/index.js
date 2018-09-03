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
 * @typedef {Object} PackageData
 * @property {string} name
 * @property {Array<string>} [keywords] - validated against {@link PluginLoader#keyword}
 * @property {Array<string>} [platforms] - validated against `process.platform`
 * @property {Object<string, string>} [engines] - validated against `process.versions`
 * @property {Object<string, string>} [peerDependencies] - validated against {@link PluginLoader#versions}
 */

/**
 * @typedef {Object} PluginLoaderOptions
 * @property {string} [keyword] - used to set {@link PluginLoader#keyword}
 * @property {string} [prefix] - used to set {@link PluginLoader#prefix}
 * @property {Object<string, string>} [versions] - used to set {@link PluginLoader#versions}
 * @property {string} [pluginPath] - used to set {@link PluginLoader#pluginPath}
 * @property {PackageData} [packageData] - used to set {@link PluginLoader#packageData}
 * @property {BasePlugin} BasePlugin - used to set {@link PluginLoader#BasePlugin}
 * @property {BasePlugin} [PluginClass] - used to set {@link PluginLoader#PluginClass}
 */

/**
 * The Plugin Loader class
 * @param {PluginLoaderOptions} opts
 */
class PluginLoader {
	constructor (opts) {
		/**
		 * A keyword, that if specified the `keywords` field of {@link PluginLoader#packageData} must contain.
		 * @type {string?}
		 */
		this.keyword = opts.keyword

		/**
		 * A prefix, that if specified the `name` field of {@link PluginLoader#packageData} must begin with.
		 * @type {string?}
		 */
		this.prefix = opts.prefix

		/**
		 * A version map, that if specified the `peerDependencies` field of {@link PluginLoader#packageData} must validate against.
		 * @type {Object<string, string>?}
		 */
		this.versions = opts.versions || {}

		/**
		 * The Base Plugin class that {@link PluginLoader#PluginClass} must inherit from.
		 * @type {BasePlugin}
		 */
		this.BasePlugin = opts.BasePlugin

		/**
		 * The absolute path to the plugin's directory.
		 * Can be omitted, if {@link PluginLoader#packageData} and {@link PluginLoader#PluginClass} are specified manually.
		 * @type {string?}
		 */
		this.pluginPath = opts.pluginPath || null

		/**
		 * An object of the essential plugin `package.json` properties.
		 * If not specified, then it is the loaded data from the `package.json` file inside {@link PluginLoader#pluginPath}.
		 * @type {PackageData}
		 */
		this.packageData = opts.packageData || null
		// load
		if (!this.packageData) {
			if (this.pluginPath) {
				this.packageData = require(
					pathUtil.resolve(this.pluginPath, 'package.json')
				)
			}
			else {
				throw new Errlop("Either the plugin's package data or the plugin's path must be specified.")
			}
		}
		// ensure
		if (!this.packageData.keywords) this.packageData.keywords = []
		if (!this.packageData.platforms) this.packageData.platforms = []
		if (!this.packageData.engines) this.packageData.engines = {}
		if (!this.packageData.peerDependencies) this.packageData.peerDependencies = {}
		// validate
		if (!this.packageData.name) {
			throw new Errlop('The plugin\'s package data must include a "name" field.')
		}

		/**
		 * The plugin name. It is resolved by:
		 *
		 * 1. Loading the `name` field of {@link PluginLoader#packageData}.
		 * 2. If {@link PluginLoader#prefix} is defined, verify the string starts with the prefix, then trim the prefix.
		 * 3. Ensure the remaining string is alphanumeric only, to avoid common naming problems.
		 *
		 * @type {string}
		 * @protected
		 * @readonly
		 */
		this.pluginName = this.packageData.name
		// validate
		if (this.prefix) {
			if (this.pluginName.startsWith(this.prefix)) {
				this.pluginName = this.pluginName.substr(this.prefix.length)
			}
			else {
				throw new Errlop(`The plugin's name of [${this.pluginName}] must begin with the prefix [${this.prefix}].`)
			}
		}
		if (alphanumeric.test(this.pluginName) === false) {
			throw new Errlop(`The plugin's name of [${this.pluginName}] must be alphanumeric to avoid common naming problems.`)
		}

		/**
		 * The Plugin Class.
		 * If not specified, then it is resolved by requiring {@link PluginLoader#pluginPath}.
		 * @type {BasePlugin}
		 */
		this.PluginClass = null
		// ensure
		if (opts.PluginClass) {
			if (this.isPluginClass(opts.PluginClass) === false) {
				throw this.error('The specified PluginClass did not inherit from the specified BasePlugin.')
			}
			this.PluginClass = opts.PluginClass
		}
		else {
			const direct = require(this.pluginPath)
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
					throw this.error('The resolved PluginClass does not inherit from the specified BasePlugin.')
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
			`${message}\nPlugin: ${this.pluginPath || this.pluginName}`,
			parent
		)
	}

	/**
	 * Instantiate the {@link PluginLoader#PluginClass} with the arguments.
	 * @param {...*} arguments to forward to the plugin class constructor
	 * @returns {BasePlugin} the instantiation result
	 * @throws {Errlop} instantiation failure reason
	 */
	create (...args) {
		try {
			// create the plugin
			const plugin = new this.PluginClass(...args)

			// ensure name is correct if specified
			if (plugin.name && plugin.name !== this.pluginName) {
				throw new Error(`The plugin instance's "name" of [${plugin.name}] must match the specified name of [${this.pluginName}].`)
			}

			// return the plugin
			return plugin
		}
		catch (err) {
			throw new Errlop(`Plugin [${this.pluginPath || this.pluginName}] failed to instantiate.`, err)
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
