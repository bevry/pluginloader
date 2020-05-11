'use strict'

module.exports = function (BasePlugin) {
	return class IndirectPlugin extends BasePlugin {
		constructor(...args) {
			super(...args)
			console.log('hello from indirect plugin')
		}
	}
}
