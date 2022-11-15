import { DependencyContainer } from "tsyringe"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class MouseEqualizer implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")

  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items

    for (let i in items)
    {
      let item = items[i]._props
      if(item.AimSensitivity)
      {
        for(let i in item.AimSensitivity[0])
        {
          item.AimSensitivity[0][i] = this.config.MouseSensitivity
        }
      }
      if(item.mousePenalty && this.config.RemoveGearPenalties)
      {
        item.mousePenalty = 0
      }
    } 
  }
}

module.exports = {mod: new MouseEqualizer()}