"use strict"

const config = require("../config/config.json")
const bots = DatabaseServer.tables.bots.types
const zarya = "5a0c27731526d80618476ac4"
const vog = ["5e32f56fcb6d5863cc5e5ee4","5e340dcdcb6d5863cc5e5efb"]
var zaryaCount = 0
var grenadeCount = 0
var vogCount = 0

class ZaryaKiller{
	static onLoadMod(){

		for(let b in bots){
			let thisBot = bots[b]
			let pockets = thisBot.inventory.items.Pockets
			let rig = thisBot.inventory.items.TacticalVest
			if (config.removeAllGrenades === true){
				thisBot.generation.items.grenades.min = 0
				thisBot.generation.items.grenades.max = 0
				grenadeCount++
			}else{
				for (let pocketContents in pockets){
					if (pockets[pocketContents] === zarya && config.removeZarya === true){
						pockets.splice(pocketContents,1)
						zaryaCount++
					}
					if (vog.includes(pockets[pocketContents]) && config.removeVog === true){
						pockets.splice(pocketContents,1)
						vogCount++
					} 
				}
				for (let rigContents in rig){
					if (rig[rigContents] === zarya && config.removeZarya === true){
						rig.splice(rigContents,1)
						zaryaCount++
					}
					if(vog.includes(rig[rigContents]) && config.removeVog === true){
						rig.splice(rigContents,1)
						vogCount++
					}
				}
			}			
		}

		if (config.debug === true){
			if (config.removeAllGrenades === true){
				Logger.log(`[kiki-ZaryaKiller] : ${grenadeCount} bot type's grenades removed`,"yellow","black")
			}else{
				if (config.removeZarya === true){
					Logger.log(`[kiki-ZaryaKiller] : ${zaryaCount} zarya's killed!`,"yellow","black")
				}
				if (config.removeVog === true){
					Logger.log(`[kiki-ZaryaKiller] : ${vogCount} bot type's VOG's removed`,"yellow","black")
				}
			}
		}
	}
}
module.exports = ZaryaKiller