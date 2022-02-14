"use strict";

const ZaryaKiller = require("./src/ZaryaKiller.js");

class Mod {
		constructor() {
			Logger.info("Loading: Kiki-ZaryaKiller");
			ModLoader.onLoad["Kiki-ZaryaKiller"] = ZaryaKiller.onLoadMod;
		}	
}

module.exports.Mod = new Mod();