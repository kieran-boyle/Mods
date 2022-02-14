"use strict";

const config = require("./config/config.json");
const BiggerStash = require("./src/BiggerStash.js");

class Mod {
		constructor() {
			Logger.info("Loading: Kiki-BiggerStash");
			ModLoader.onLoad["Kiki-BiggerStash"] = BiggerStash.onLoadMod;
		}	
}

module.exports.Mod = new Mod();