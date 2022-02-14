"use strict"

const AllTheBoss = require("./src/AllTheBoss.js")

class Mod {

    constructor() {

        HttpRouter.onStaticRoute["/client/game/bot/generate"] = {
            "mod": Mod.generateBots
        }

        Logger.info("Loading: Kiki-AllTheBoss")
        ModLoader.onLoad["Kiki-AllTheBoss"] = AllTheBoss.onLoadMod
    }
}

module.exports.Mod = new Mod()