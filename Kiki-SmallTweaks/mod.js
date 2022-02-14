"use strict"

//const config = require("../config/config.json")
const smallTweaks = require("./src/smallTweaks.js")

class Mod {

	constructor() {
		
		Logger.info("Loading: Kiki-smallTweaks")
		ModLoader.onLoad["Kiki-smallTweaks"] = smallTweaks.onLoadMod
	}
}

module.exports.Mod = new Mod()