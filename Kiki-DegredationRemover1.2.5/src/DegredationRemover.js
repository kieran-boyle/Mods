"use strict"
const traders = DatabaseServer.tables.traders
const config = require("../config/config.json")

class DegredationRemover{
	static onLoadMod(){
		for(let eachTrader in traders){
			let base = traders[eachTrader].base
			for(let eachLevel in base.loyaltyLevels){
				let level = base.loyaltyLevels[eachLevel]
				base.nickname === "Prapor" ?
					level.repair_price_coef *= config.repairPriceMultiplier + 50 :
					level.repair_price_coef *= config.repairPriceMultiplier
			}
			base.repair.quality *= config.qualityMultiplier
		}
		if(config.repairPriceMultiplier != 1 && config.debug === true){
			Logger.log(`[Kiki-DegredationRemover] : All trader repair prices have been multiplied by ${config.repairPriceMultiplier}`,"yellow","black")
		}
		if(config.qualityMultiplier != 1 && config.debug === true){
			Logger.log(`[Kiki-DegredationRemover] : All trader repair quality have been multiplied by ${config.qualityMultiplier}`,"yellow","black")
		}
	}
}
module.exports = DegredationRemover