/* eslint-disable no-console */
'use strict'

const BasePlugin = require('../baseplugin.js')
module.exports = class DirectPlugin extends BasePlugin {
	constructor(...args) {
		super(...args)
		console.log('hello from direct plugin')
	}
}
