"use strict"

const AllTheBoss = require("./src/AllTheBoss.js")
const config = require("./config/config.json")

class Mod {
		constructor() {
			HttpRouter.onStaticRoute["/client/game/bot/generate"] = {
                "mod": Mod.generateBots
            }
			Logger.info("Loading: Kiki-AllTheBoss")
			ModLoader.onLoad["Kiki-AllTheBoss"] = AllTheBoss.onLoadMod
		}
		static generateBots(url, info, sessionID) {
            let a = HttpResponse.getBody(BotController.generate(info))
            a = JsonUtil.deserialize(a)
            a = a.data
            for (let bot in a) {
                if (a[bot].Info.Settings.Role.toLowerCase().includes("boss") || a[bot].Info.Settings.Role.toLowerCase().includes("sectant")){
					if (config.debug === true) {
						Logger.log(`[Kiki-AllTheBoss] : Boss spawned! ${a[bot].Info.Settings.Role}`,"red", "black")
					}
				}
            }
            return HttpResponse.getBody(a)
        }
}

module.exports.Mod = new Mod()