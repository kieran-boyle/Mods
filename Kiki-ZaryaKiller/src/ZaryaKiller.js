"use strict"

const CONFIG = require("../config/config.json")
const BOTS = DatabaseServer.tables.bots.types
const ZARYA = "5a0c27731526d80618476ac4"
const VOG = ["5e32f56fcb6d5863cc5e5ee4", "5e340dcdcb6d5863cc5e5efb"]

class ZaryaKiller {

	static onLoadMod() {

		var zaryaCount = 0
		var grenadeCount = 0
		var vogCount = 0

		for (let b in BOTS) {
			let thisBot = BOTS[b]
			let pockets = thisBot.inventory.items.Pockets
			let rig = thisBot.inventory.items.TacticalVest

			if (CONFIG.removeAllGrenades === true) {
				thisBot.generation.items.grenades.min = 0
				thisBot.generation.items.grenades.max = 0
				grenadeCount++

			} else {

				for (let pocketContents in pockets) {

					if (pockets[pocketContents] === ZARYA && CONFIG.removeZarya === true) {
						pockets.splice(pocketContents, 1)
						zaryaCount++
					}

					if (VOG.includes(pockets[pocketContents]) && CONFIG.removeVog === true) {
						pockets.splice(pocketContents, 1)
						vogCount++
					}
				}

				for (let rigContents in rig) {

					if (rig[rigContents] === ZARYA && CONFIG.removeZarya === true) {
						rig.splice(rigContents, 1)
						zaryaCount++
					}

					if (VOG.includes(rig[rigContents]) && CONFIG.removeVog === true) {
						rig.splice(rigContents, 1)
						vogCount++
					}
				}
			}
		}

		if (CONFIG.debug === true) {

			if (CONFIG.removeAllGrenades === true) {
				Logger.log(`[kiki-ZaryaKiller] : ${grenadeCount} bot type's grenades removed`, "yellow", "black")

			} else {

				if (CONFIG.removeZarya === true) {
					Logger.log(`[kiki-ZaryaKiller] : ${zaryaCount} zarya's killed!`, "yellow", "black")
				}

				if (CONFIG.removeVog === true) {
					Logger.log(`[kiki-ZaryaKiller] : ${vogCount} bot type's VOG's removed`, "yellow", "black")
				}
			}
		}
	}
}

module.exports = ZaryaKiller