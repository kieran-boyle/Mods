"use strict"

const CameraRecoilRemover = require("./src/CameraRecoilRemover.js")

class Mod {

	constructor() {

		Logger.info("Loading: Kiki-CameraRecoilRemover")
		ModLoader.onLoad["Kiki-CameraRecoilRemover"] = CameraRecoilRemover.onLoadMod
	}
}

module.exports.Mod = new Mod()