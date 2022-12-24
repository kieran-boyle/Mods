import type { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class MedTweaker implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger :ILogger

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
      if (parents.includes(items[i]._parent)) this.setMedStats(items[i])
    }
  }

  private setMedStats(item :any):void
  {
    if (item._props.MaxHpResource) item._props.MaxHpResource *= this.config.MaxHpResource
    if (item._props.hpResourceRate) item._props.hpResourceRate *= this.config.hpResourceRate
    if (item._props.medUseTime) item._props.medUseTime *= this.config.medUseTime
    if (item._props.effects_damage != []) this.setEffects(item, 'effects_damage')
    if (item._props.effects_health != []) this.setEffects(item, 'effects_health')   
  }

  private setEffects(item :any, target :string):void
  {
    for (let effect in item._props[target])
    {
      for (let prop in item._props[target][effect])
      {
        if (this.config[target][effect] && item._props[target][effect][prop] != 0)
        {
          item._props[target][effect][prop] *= this.config[target][effect][prop]
        }
      }
      if (this.config.debug === true)
      {
        this.logger.log(`\n[Kiki-MedTweaker-Debug] : ${item._props.Name} ${effect} ${JSON.stringify(item._props[target][effect], 0, 4)}`, "yellow", "black")
      }
    }
  }
}

module.exports = {mod: new MedTweaker()}