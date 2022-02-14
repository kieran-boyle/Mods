"use strict";

const config = require("./config/config.json");
const CameraRecoilRemover = require("./src/CameraRecoilRemover.js");

class Mod {
		constructor() {
			Logger.info("Loading: Kiki-CameraRecoilRemover");
			ModLoader.onLoad["Kiki-CameraRecoilRemover"] = CameraRecoilRemover.onLoadMod;
		}	
}

module.exports.Mod = new Mod();