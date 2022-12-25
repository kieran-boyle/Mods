import type { DependencyContainer } from "tsyringe"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class ZaryaKiller implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private zarya = "5a0c27731526d80618476ac4"
  private impacts = ["617fd91e5539a84ec44ce155", "618a431df1eb8e24b8741deb"]
  private VOGs = ["5e32f56fcb6d5863cc5e5ee4", "5e340dcdcb6d5863cc5e5efb"]

  /**
   * Loops through each bot and removes grenades requested by the config
   * @param container Container
   */
  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    const bots = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().bots.types
    
    for (let b in bots)
    {
      let thisBot = bots[b]
      if (this.config.removeAllGrenades === true)
      {
        thisBot.generation.items.grenades.min = 0
        thisBot.generation.items.grenades.max = 0
      }
      else
      {
        this.removeGrenades(thisBot.inventory.items.Pockets)
        this.removeGrenades(thisBot.inventory.items.TacticalVest)
      }
    }
  }

  /**
   * Searches through bot inventory for given keys and removes them if found
   * @param input section of bot inventory to search
   */
  private removeGrenades(input :any):void
    {
      for(let i = input.length; i > 0; i--)
      {
        if((this.impacts.includes(input[i]) && this.config.removeImpact === true) 
          || (this.VOGs.includes(input[i]) && this.config.removeVog === true)
          || (input[i] === this.zarya && this.config.removeZarya === true))
            input.splice(i, 1)
      }
    }
}

module.exports = {mod: new ZaryaKiller()}