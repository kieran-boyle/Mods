"use strict"

const TRADERS = DatabaseServer.tables.traders
const CONFIG = require("../config/config.json")

class DegredationRemover {

	static onLoadMod() {

		for (let eachTrader in TRADERS) {
			let base = TRADERS[eachTrader].base

			for (let eachLevel in base.loyaltyLevels) {
				let level = base.loyaltyLevels[eachLevel]

				base.nickname === "Prapor" ?
					level.repair_price_coef *= CONFIG.repairPriceMultiplier + 50 :
					level.repair_price_coef *= CONFIG.repairPriceMultiplier
			}
			base.repair.quality *= CONFIG.qualityMultiplier
		}

		if (CONFIG.repairPriceMultiplier != 1 && CONFIG.debug === true) {
			Logger.log(`[Kiki-DegredationRemover] : All trader repair prices have been multiplied by ${CONFIG.repairPriceMultiplier}`, "yellow", "black")
		}

		if (CONFIG.qualityMultiplier != 1 && CONFIG.debug === true) {
			Logger.log(`[Kiki-DegredationRemover] : All trader repair quality have been multiplied by ${CONFIG.qualityMultiplier}`, "yellow", "black")
		}
	}
}

module.exports = DegredationRemover