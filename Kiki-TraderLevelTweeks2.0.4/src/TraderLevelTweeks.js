"use strict"

const CONFIG = require("../config/config.json")
const TRADERS = DatabaseServer.tables.traders

class TraderLevelTweeks {

	static onLoadMod() {

		for (let trader in TRADERS) {

			if (CONFIG.cantBuy === true) {
				TRADERS[trader].base.sell_category = []
			}

			for (let eachLevel in TRADERS[trader].base.loyaltyLevels) {

				if (CONFIG.minLevel === true) {

					for (let minLevel in TRADERS[trader].base.loyaltyLevels[eachLevel]) {
						TRADERS[trader].base.loyaltyLevels[eachLevel].minLevel = 0
					}
				}

				if (CONFIG.minSalesSum === true) {

					for (let minSalesSum in TRADERS[trader].base.loyaltyLevels[eachLevel]) {
						TRADERS[trader].base.loyaltyLevels[eachLevel].minSalesSum = 0
					}
				}

				if (CONFIG.minStanding === true) {

					for (let minStanding in TRADERS[trader].base.loyaltyLevels[eachLevel]) {
						TRADERS[trader].base.loyaltyLevels[eachLevel].minStanding = 0
					}
				}
			}
		}
	}
}

module.exports = TraderLevelTweeks