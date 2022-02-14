"use strict";

const HealthMultiplier = require("./src/HealthMultiplier.js");

class Mod {
		constructor() {
			Logger.info("Loading: Kiki-HealthMultiplier");
			ModLoader.onLoad["Kiki-HealthMultiplier"] = HealthMultiplier.onLoadMod;
			HttpRouter.onStaticRoute["/client/game/start"]["healthmultiplier"] = HealthMultiplier.runOnGameStart
		}	
}

module.exports.Mod = new Mod();