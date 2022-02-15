"use strict"

class TraderLevelTweeks {

	static onLoadMod() {
		
		const config = require("../config/config.json")
		const traders = DatabaseServer.tables.traders

		for (let trader in traders) {

			if (config.cantBuy === true)
				traders[trader].base.sell_category = []

			for (let eachLevel in traders[trader].base.loyaltyLevels) {

				if (config.minLevel === true)
					traders[trader].base.loyaltyLevels[eachLevel].minLevel = 0

				if (config.minSalesSum === true)
					traders[trader].base.loyaltyLevels[eachLevel].minSalesSum = 0

				if (config.minStanding === true)
					traders[trader].base.loyaltyLevels[eachLevel].minStanding = 0
			}
		}
	}
}

module.exports = TraderLevelTweeks