"use strict"

const TraderLevelTweeks = require("./src/TraderLevelTweeks.js")

class Mod {

	constructor() {

		Logger.info("Loading: Kiki-TraderLevelTweeks")
		ModLoader.onLoad["Kiki-TraderLevelTweeks"] = TraderLevelTweeks.onLoadMod
	}
}

module.exports.Mod = new Mod()