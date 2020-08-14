// Import
import { resolve } from 'path'
import Errlop from 'errlop'
import { satisfies } from 'semver'
import { isClass } from 'typechecker'

// Local
const alphanumeric = /^[a-z0-9]+$/

// Types
/** Log method */
type Log = Function
/** Validated against {@link PluginLoader#keyword} */
type Keywords = string[]
/** A map of items to their version numbers */
type Versions = { [item: string]: string | number }
/** A map of itemsto their version ranges  */
type Ranges = { [item: string]: string }
/** Validated against `process.platform` */
type Platforms = string[]
/** The package.json data required for {@link PluginLoader} */
interface PackageData {
	name: string
	keywords: Keywords
	platforms: Platforms
	/** Validated against `process.versions` */
	engines: Partial<NodeJS.ProcessVersions>
	/** Validated against {@link PluginLoader#versions} */
	peerDependencies: Ranges
}

/**
 * Receive the BasePlugin class and return a class that extended it.
 * @example
 * module.exports = (BasePlugin) => class MyPlugin extends BasePlugin {}
 */
type BasePluginResolver<BasePlugin> = (BasePlugin: BasePlugin) => BasePlugin

/** Check the specified versions against the specified ranges */
function checkVersions(versions: Versions, ranges: Ranges, group: string) {
	const errors = []
	if (ranges) {
		for (const thing in versions) {
			if (versions.hasOwnProperty(thing)) {
				// the .replace is to support version flags, such as -beta
				const version = String(versions[thing]).replace(/-.+/, '')
				const range = ranges[thing]
				if (range && satisfies(version, range) === false) {
					errors.push(
						new Errlop(
							`${group} [${thing} = ${range}] unsupported by plugin's range [${range}]`
						)
					)
				}
			}
		}
	}
	return errors
}

interface PluginLoaderOptions<BasePlugin> {
	/** used to set {@link PluginLoader#BasePlugin} */
	BasePlugin: BasePlugin
	/** used to output debug messages if it exists */
	log?: Log
	/** used to set {@link PluginLoader#keyword} */
	keyword?: string
	/** used to set {@link PluginLoader#prefix} */
	prefix?: string
	/** used to set {@link PluginLoader#versions} */
	versions?: { [key: string]: string }
	/** used to set {@link PluginLoader#pluginPath} */
	pluginPath?: string
	/** used to set {@link PluginLoader#packageData} */
	packageData?: Partial<PackageData>
	/** used to set {@link PluginLoader#PluginClass} */
	PluginClass?: BasePlugin | BasePluginResolver<BasePlugin>
}

/** The Plugin Loader class */
export default class PluginLoader<BasePlugin> {
	/** A method, that if specified, will be used to output debug messages. */
	log: Log

	/** A keyword, that if specified then the `keywords` field of {@link PluginLoader#packageData} must contain. */
	keyword?: string

	/** A prefix, that if specified then the `name` field of {@link PluginLoader#packageData} must begin with. */
	prefix?: string

	/** A version map, that if specified then the `peerDependencies` field of {@link PluginLoader#packageData} must validate against. */
	versions: Versions

	/** The Base Plugin class that {@link PluginLoader#PluginClass} must inherit from. */
	BasePlugin: BasePlugin

	/**
	 * The absolute path to the plugin's directory.
	 * Can be omitted, if {@link PluginLoader#packageData} and {@link PluginLoader#PluginClass} are specified manually.
	 */
	pluginPath?: string

	/**
	 * An object of the essential plugin `package.json` properties.
	 * If not specified, then it is the loaded data from the `package.json` file inside {@link PluginLoader#pluginPath}.
	 */
	packageData: PackageData

	/**
	 * The plugin name. It is resolved by:
	 * 1. Loading the `name` field of {@link PluginLoader#packageData}.
	 * 2. If {@link PluginLoader#prefix} is defined, verify the string starts with the prefix, then trim the prefix.
	 * 3. Ensure the remaining string is alphanumeric only, to avoid common naming problems.
	 */
	readonly pluginName: string

	/**
	 * The Plugin Class.
	 * If not specified, then it is resolved by requiring {@link PluginLoader#pluginPath}.
	 */
	PluginClass: BasePlugin

	constructor(opts: PluginLoaderOptions<BasePlugin>) {
		this.log = opts.log || function () {}
		this.keyword = opts.keyword
		this.prefix = opts.prefix
		this.versions = opts.versions || {}
		this.BasePlugin = opts.BasePlugin
		this.pluginPath = opts.pluginPath

		// load
		if (!opts.packageData) {
			if (this.pluginPath) {
				this.packageData = require(resolve(this.pluginPath, 'package.json'))
			} else {
				throw new Errlop(
					"Either the plugin's package data or the plugin's path must be specified."
				)
			}
		} else {
			this.packageData = opts.packageData as PackageData
		}

		// validate
		if (!this.packageData.name) {
			throw new Errlop(
				'The plugin\'s package data must include a "name" field.'
			)
		}

		// ensure
		if (!this.packageData.keywords) this.packageData.keywords = []
		if (!this.packageData.platforms) this.packageData.platforms = []
		if (!this.packageData.engines) this.packageData.engines = {}
		if (!this.packageData.peerDependencies)
			this.packageData.peerDependencies = {}

		// apply
		this.pluginName = this.packageData.name

		// validate
		if (this.prefix) {
			// .startsWith is only available node >= 0.12
			if (this.pluginName.indexOf(this.prefix) === 0) {
				this.pluginName = this.pluginName.substr(this.prefix.length)
			} else {
				throw new Errlop(
					`The plugin's name of [${this.pluginName}] must begin with the prefix [${this.prefix}].`
				)
			}
		}
		if (alphanumeric.test(this.pluginName) === false) {
			throw new Errlop(
				`The plugin's name of [${this.pluginName}] must be alphanumeric to avoid common naming problems.`
			)
		}

		/**
		 * The Plugin Class.
		 * If not specified, then it is resolved by requiring {@link PluginLoader#pluginPath}.
		 * @type {BasePlugin}
		 */
		this.PluginClass = this.resolve(
			opts.PluginClass || require(this.pluginPath as string)
		)

		// Validate
		this.validate()
	}

	/**
	 * Alternative means for creating a {@link PluginLoader} instance.
	 */
	static create<BasePlugin>(opts: PluginLoaderOptions<BasePlugin>) {
		return new this<BasePlugin>(opts)
	}

	/**
	 * Resolve the input as the plugin class
	 * @throws {Errlop} resolve failure reason
	 */
	protected resolve(
		direct: BasePlugin | BasePluginResolver<BasePlugin>
	): BasePlugin {
		if (isClass(direct)) {
			// module.exports = class MyPlugin extends require('...-baseplugin') {}
			this.log('debug', `The plugin [${this.pluginPath}] was resolved directly`)
			return direct as BasePlugin
		} else {
			// module.exports = (BasePlugin) -> class MyPlugin extends BasePlugin {}
			let indirect: BasePlugin
			try {
				indirect = (direct as BasePluginResolver<BasePlugin>)(this.BasePlugin)
			} catch (err) {
				if (
					/Class constructor \w+ cannot be invoked without 'new'/.test(
						err.message
					)
				) {
					// for some reason, isClass(direct) returned `false`, this should not happen
					this.log(
						'warn',
						this.error(
							'pluginloader encountered a direct result that had a false negative with class detection\n' +
								'everything will work fine, but this should be fixed by the plugin author\n' +
								'the direct result in question is:\n' +
								(direct as any).toString()
						)
					)
					this.log(
						'debug',
						`The plugin [${this.pluginPath}] was resolved directly, via false negative fallback`
					)
					return direct as BasePlugin
				} else {
					throw this.error(
						'The indirect resolution of the PluginClass failed.',
						err
					)
				}
			}
			if (isClass(indirect)) {
				this.log(
					'debug',
					`The plugin [${this.pluginPath}] was resolved indirectly`
				)
				return indirect
			} else {
				throw this.error(
					'The resolved PluginClass was not detectable as a class.'
				)
			}
		}
	}

	/**
	 * Check if this plugin is supported
	 * @returns supported
	 * @throws {Errlop} supported failure reason
	 */
	protected validate(): boolean {
		const { keywords, platforms, engines, peerDependencies } = this.packageData
		const errors = []

		if (this.keyword && keywords.includes(this.keyword) === false) {
			errors.push(
				new Errlop(
					`keyword [${
						this.keyword
					}] missing from the plugin's keywords [${keywords.join(', ')}]`
				)
			)
		}
		if (platforms.length && platforms.includes(process.platform) === false) {
			errors.push(
				new Errlop(
					`platform [${
						process.platform
					}] unsupported by plugin's engines [${platforms.join(', ')}]`
				)
			)
		}
		if (engines) {
			// @ts-ignore
			errors.push(...checkVersions(process.versions, engines, 'engine'))
		}
		if (peerDependencies) {
			errors.push(
				...checkVersions(this.versions, peerDependencies, 'peer dependency')
			)
		}

		if (errors.length) {
			throw new Errlop(
				`Plugin [${this.pluginPath}] is unsupported.`,
				errors.length === 1
					? errors[0]
					: new Errlop(errors.map((error) => error.stack).join('\n'))
			)
		}

		return true
	}

	/** Helper for creating Errlop instances against the plugin. */
	protected error(message: string, parent?: Error) {
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
	create<Args extends any[]>(...args: Args) {
		// prepare
		const { PluginClass } = this

		try {
			// create the plugin
			// @ts-ignore
			const plugin = new PluginClass(...args)

			// ensure name is correct if specified
			if (plugin.name && plugin.name !== this.pluginName) {
				throw new Error(
					`The plugin instance's "name" of [${plugin.name}] must match the specified name of [${this.pluginName}].`
				)
			}

			// return the plugin
			return plugin
		} catch (err) {
			throw new Errlop(
				`Plugin [${this.pluginPath || this.pluginName}] failed to instantiate.`,
				err
			)
		}
	}
}
