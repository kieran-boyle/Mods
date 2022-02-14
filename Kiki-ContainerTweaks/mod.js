"use strict"

const ContainerTweaks = require("./src/ContainerTweaks.js");

class Mod {

	constructor() {
		
		Logger.info("Loading: Kiki-ContainerTweaks")
		ModLoader.onLoad["Kiki-ContainerTweaks"] = ContainerTweaks.onLoadMod
	}
}

module.exports.Mod = new Mod()