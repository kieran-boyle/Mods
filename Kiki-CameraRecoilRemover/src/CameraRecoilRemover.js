"use strict"

const CONFIG = require("../config/config.json")
const ITEMS = DatabaseServer.tables.templates.items
const WEAPONCLASSLIST = [
	"pistol",
	"smg",
	"shotgun",
	"assaultRifle",
	"assaultCarbine",
	"machinegun",
	"marksmanRifle",
	"sniperRifle"
]

class CameraRecoilRemover {

	static onLoadMod() {

		for (let eachItem in ITEMS) {

			if (WEAPONCLASSLIST.includes(ITEMS[eachItem]._props.weapClass)) {
				ITEMS[eachItem]._props.CameraRecoil *= CONFIG.CameraRecoil
			}
		}

		if (CONFIG.debug === true) {
			Logger.log(`[Kiki-CameraRecoilRemover] : Camera recoil is multiplied by ${CONFIG.CameraRecoil}`, "yellow", "black")
		}
	}
}

module.exports = CameraRecoilRemover