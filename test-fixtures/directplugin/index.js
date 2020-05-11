'use strict'

module.exports = class DirectPlugin extends require('../baseplugin.js') {
	constructor(...args) {
		super(...args)
		console.log('hello from direct plugin')
	}
}
