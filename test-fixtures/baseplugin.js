/* eslint-disable no-console */
'use strict'

module.exports = class BasePlugin {
	constructor(...args) {
		console.log('hello from base plugin', ...args)
	}
}
