"use strict";

const ArmorDebuffRemover = require("./src/ArmorDebuffRemover.js");
const config = require("./config/config.json");

class Mod {
		constructor() {
			Logger.info("Loading: Kiki-ArmorDebuffRemover");
			ModLoader.onLoad["Kiki-ArmorDebuffRemover"] = ArmorDebuffRemover.onLoadMod;
		}	
}

module.exports.Mod = new Mod();