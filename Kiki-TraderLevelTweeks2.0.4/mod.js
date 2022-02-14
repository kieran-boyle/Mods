"use strict";

const TraderLevelTweeks = require("./src/TraderLevelTweeks.js");
const config = require("./config/config.json");

class Mod {
		constructor() {
			Logger.info("Loading: Kiki-TraderLevelTweeks");
			ModLoader.onLoad["Kiki-TraderLevelTweeks"] = TraderLevelTweeks.onLoadMod;
		}	
}

module.exports.Mod = new Mod();