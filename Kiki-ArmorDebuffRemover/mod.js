"use strict"

const ArmorDebuffRemover = require("./src/ArmorDebuffRemover.js")

class Mod
{

  constructor()
  {

    Logger.info("Loading: Kiki-ArmorDebuffRemover")
    ModLoader.onLoad["Kiki-ArmorDebuffRemover"] = ArmorDebuffRemover.onLoadMod
  }
}

module.exports.Mod = new Mod()