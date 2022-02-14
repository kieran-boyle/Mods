"use strict"

const DegredationRemover = require("./src/DegredationRemover.js")

class Mod {

	constructor() {
		
		Logger.info("Loading: Kiki-DegredationRemover")
		ModLoader.onLoad["Kiki-DegredationRemover"] = DegredationRemover.onLoadMod
	}
}

module.exports.Mod = new Mod()