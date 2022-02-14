"use strict"

const AllTheBoss = require("./src/AllTheBoss.js")

class Mod {

    constructor() {

        Logger.info("Loading: Kiki-AllTheBoss")
        ModLoader.onLoad["Kiki-AllTheBoss"] = AllTheBoss.onLoadMod
    }
}

module.exports.Mod = new Mod()