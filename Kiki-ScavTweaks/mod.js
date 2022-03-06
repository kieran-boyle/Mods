"use strict"

class ScavTweaks
{

  constructor()
  {
    Logger.info("Loading: Kiki-ScavTweaks")
    HttpRouter.onStaticRoute["/raid/profile/save"]["scav"] = ScavTweaks.setScavCooldown
  }

  static setScavCooldown(url, obj, id, output)
  {
    const gConfig = DatabaseServer.tables.globals.config
    const config = require("./config/config.json")

    if (obj.isPlayerScav === true)
    {
      switch (obj.exit)
      {
        case "survived":
          gConfig.SavagePlayCooldown = config.ScavTimeIfSurvive
          break

        case "runner":
          gConfig.SavagePlayCooldown = config.ScavTimeRunThrough
          break

        case "killed":
          gConfig.SavagePlayCooldown = config.ScavTimeDead
          break

        default:
          gConfig.SavagePlayCooldown = config.ScavTimeDead
          break
      }
    }

    return output
  }
}

module.exports.ScavTweaks = new ScavTweaks()