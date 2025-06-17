import type { DependencyContainer } from "tsyringe"
import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt/servers/DatabaseServer"
import Config from "../config/config.json"

class TraderLevelTweeks implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = Config

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    const traders = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().traders

    for (let trader in traders)
    {

      if (this.config.cantBuy === true)
      {
        traders[trader].base.sell_category = []
      }

      for (let eachLevel in traders[trader].base.loyaltyLevels)
      {

        if (this.config.minLevel === true)
        {
          traders[trader].base.loyaltyLevels[eachLevel].minLevel = 0
        }

        if (this.config.minSalesSum === true)
        {
          traders[trader].base.loyaltyLevels[eachLevel].minSalesSum = 0
        }

        if (this.config.minStanding === true)
        {
          traders[trader].base.loyaltyLevels[eachLevel].minStanding = 0
        }
      }
    }
  }
}

module.exports = {mod: new TraderLevelTweeks()}