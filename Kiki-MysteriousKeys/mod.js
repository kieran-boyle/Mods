"use strict"

const MysteriousKeys = require("./src/MysteriousKeys.js")

class Mod
{

  constructor()
  {

    Logger.info("Loading: Kiki-MysteriousKeys")
    ModLoader.onLoad["Kiki-MysteriousKeys"] = MysteriousKeys.onLoadMod
  }
}

module.exports.Mod = new Mod()