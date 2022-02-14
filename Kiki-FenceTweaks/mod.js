"use strict"

const FenceTweaks = require("./src/FenceTweaks.js")

class Mod {

	constructor() {

		Logger.info("Loading: Kiki-FenceTweaks")
		ModLoader.onLoad["Kiki-FenceTweaks"] = FenceTweaks.onLoadMod
	}
}

module.exports.Mod = new Mod()