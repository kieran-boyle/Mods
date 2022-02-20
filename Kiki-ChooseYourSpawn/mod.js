"use strict"

const ChooseYourSpawn = require("./src/ChooseYourSpawn.js")

class Mod
{

  constructor()
  {

    Logger.info("Loading: Kiki-ChooseYourSpawn")
    ModLoader.onLoad["Kiki-ChooseYourSpawn"] = ChooseYourSpawn.onLoadMod
  }
}

module.exports.Mod = new Mod()