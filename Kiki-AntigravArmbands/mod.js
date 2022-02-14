"use strict"

const AntigravArmbands = require("./src/AntigravArmbands.js")

class Mod {

	constructor() {
		Logger.info("Loading: Kiki-AntigravArmbands")
		ModLoader.onLoad["Kiki-AntigravArmbands"] = AntigravArmbands.onLoadMod
	}
}

module.exports.Mod = new Mod()