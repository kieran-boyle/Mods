"use strict";

const config = require("../config/config.json");
const traders = DatabaseServer.tables.traders;

class TraderLevelTweeks{
	static onLoadMod(){
		for (let trader in traders){
			if (config.cantBuy === true){
				traders[trader].base.sell_category = [];
			}
			for (let eachLevel in traders[trader].base.loyaltyLevels){
				if (config.minLevel === true){
					for (let minLevel in traders[trader].base.loyaltyLevels[eachLevel]){
						traders[trader].base.loyaltyLevels[eachLevel].minLevel =  0;
					}
				}
				if (config.minSalesSum === true){
					for (let minSalesSum in traders[trader].base.loyaltyLevels[eachLevel]){
						traders[trader].base.loyaltyLevels[eachLevel].minSalesSum =  0;
					}
				}
				if (config.minStanding === true){
					for (let minStanding in traders[trader].base.loyaltyLevels[eachLevel]){
						traders[trader].base.loyaltyLevels[eachLevel].minStanding =  0;
					}
				}
			}
		}
	}
}
module.exports = TraderLevelTweeks;