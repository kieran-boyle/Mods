"use strict";

const MedTweaker = require("./src/MedTweaker.js");

class Mod {
		constructor() {
			Logger.info("Loading: Kiki-MedTweaker");
			ModLoader.onLoad["Kiki-MedTweaker"] = MedTweaker.onLoadMod;
		}	
}

module.exports.Mod = new Mod();