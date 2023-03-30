import type { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes"
import { ConfigServer } from "@spt-aki/servers/ConfigServer"

class DegredationRemover implements IPostDBLoadMod
{

  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger :ILogger

  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const traders = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().traders    
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items
    const traderConfig  = this.container.resolve<ConfigServer>("ConfigServer").getConfig(ConfigTypes.TRADER)
    const repairConfig = this.container.resolve<ConfigServer>("ConfigServer").getConfig(ConfigTypes.REPAIR)
    const repairKits = ["591094e086f7747caa7bb2ef", "5910968f86f77425cf569c32"]

    repairKits.forEach(kit => items[kit]._props.RepairQuality = this.config.qualityMultiplier)
    repairConfig.applyRandomizeDurabilityLoss = false

    if (this.config.fullDurabilityFence) //All items from fence can be fully repaired to 100% durability
    {
      traderConfig.fence.presetMaxDurabilityPercentMinMax.min = 100
      traderConfig.fence.presetMaxDurabilityPercentMinMax.max = 100
      traderConfig.fence.armorMaxDurabilityPercentMinMax.min = 100
      traderConfig.fence.armorMaxDurabilityPercentMinMax.max = 100
    }
    
    for (let eachTrader in traders)
    {
      let base = traders[eachTrader].base

      for (let eachLevel in base.loyaltyLevels)
      {
        let level = base.loyaltyLevels[eachLevel]

        base.nickname === "Prapor" ?
          level.repair_price_coef *= this.config.repairPriceMultiplier + 50 :
          level.repair_price_coef *= this.config.repairPriceMultiplier
      }
      base.repair.quality *= this.config.qualityMultiplier
    }

    if (this.config.repairPriceMultiplier != 1 && this.config.debug === true)
    {
      this.logger.log(`[Kiki-DegredationRemover] : All trader repair prices have been multiplied by ${this.config.repairPriceMultiplier}`, "yellow", "black")
    }

    if (this.config.qualityMultiplier != 1 && this.config.debug === true)
    {
      this.logger.log(`[Kiki-DegredationRemover] : All trader repair quality have been multiplied by ${this.config.qualityMultiplier}`, "yellow", "black")
    }
  }
}

module.exports = {mod: new DegredationRemover()}