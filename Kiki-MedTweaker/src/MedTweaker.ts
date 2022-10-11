import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class MedTweaker implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items
    const parents = [
      "5448f39d4bdc2d0a728b4568", //med
      "5448f3a64bdc2d60728b456a", //stim
      "5448f3a14bdc2d27728b4569", //drug
      "5448f3ac4bdc2dce718b4569", //medical item
    ]

    for (let i in items)
    {
      let item = items[i]

      if (parents.includes(item._parent))
      {

        if (item._props.MaxHpResource)
        {
          item._props.MaxHpResource *= this.config.MaxHpResource
        }

        if (item._props.hpResourceRate)
        {
          item._props.hpResourceRate *= this.config.hpResourceRate
        }

        if (item._props.medUseTime)
        {
          item._props.medUseTime *= this.config.medUseTime
        }

        if (item._props.effects_damage != [])
        {

          for (let effect in item._props.effects_damage)
          {

            for (let prop in item._props.effects_damage[effect])
            {

              if (this.config.effects_damage[effect] && item._props.effects_damage[effect][prop] != 0)
              {
                item._props.effects_damage[effect][prop] *= this.config.effects_damage[effect][prop]
              }
            }

            if (this.config.debug === true)
            {
              this.logger.log(`\n[Kiki-MedTweaker-Debug] : ${item._props.Name} ${effect} ${JSON.stringify(item._props.effects_damage[effect], 0, 4)}`, "yellow", "black")
            }
          }
        }

        if (item._props.effects_health != [])
        {

          for (let effect in item._props.effects_health)
          {

            for (let prop in item._props.effects_health[effect])
            {
              item._props.effects_health[effect][prop] *= this.config.effects_health[effect][prop]
            }

            if (this.config.debug === true)
            {
              this.logger.log(`\n[Kiki-MedTweaker-Debug] : ${item._props.Name} ${effect} ${JSON.stringify(item._props.effects_health[effect], 0, 4)}`, "yellow", "black")
            }
          }
        }
      }
    }
  }
}

module.exports = {mod: new MedTweaker()}