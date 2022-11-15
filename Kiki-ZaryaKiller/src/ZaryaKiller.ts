import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class ZaryaKiller implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container    
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const bots = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().bots.types
    const zarya = "5a0c27731526d80618476ac4"
    const impacts = ["617fd91e5539a84ec44ce155", "618a431df1eb8e24b8741deb"]
    const VOGs = ["5e32f56fcb6d5863cc5e5ee4", "5e340dcdcb6d5863cc5e5efb"]
    var zaryaCount = 0
    var grenadeCount = 0
    var vogCount = 0
    var impactCount = 0

    for (let b in bots)
    {
      let thisBot = bots[b]
      let pockets = thisBot.inventory.items.Pockets
      let rig = thisBot.inventory.items.TacticalVest

      if (this.config.removeAllGrenades === true)
      {
        thisBot.generation.items.grenades.min = 0
        thisBot.generation.items.grenades.max = 0
        grenadeCount++

      }
      else
      {

        for (let pocketContents in pockets)
        {

          if (pockets[pocketContents] === zarya && this.config.removeZarya === true)
          {
            pockets.splice(pocketContents, 1)
            zaryaCount++
          }

          if (VOGs.includes(pockets[pocketContents]) && this.config.removeVog === true)
          {
            pockets.splice(pocketContents, 1)
            vogCount++
          }

          if (impacts.includes(pockets[pocketContents]) && this.config.removeImpact === true)
          {
            pockets.splice(pocketContents, 1)
            impactCount++
          }
        }

        for (let rigContents in rig)
        {

          if (rig[rigContents] === zarya && this.config.removeZarya === true)
          {
            rig.splice(rigContents, 1)
            zaryaCount++
          }

          if (VOGs.includes(rig[rigContents]) && this.config.removeVog === true)
          {
            rig.splice(rigContents, 1)
            vogCount++
          }

          if (impacts.includes(rig[rigContents]) && this.config.removeImpact === true)
          {
            rig.splice(rigContents, 1)
            impactCount++
          }
        }
      }
    }

    if (this.config.debug === true)
    {

      if (this.config.removeAllGrenades === true)
      {
        this.logger.log(`[kiki-ZaryaKiller] : ${grenadeCount} bot type's grenades removed`, "yellow", "black")

      }
      else
      {

        if (this.config.removeZarya === true)
        {
          this.logger.log(`[kiki-ZaryaKiller] : ${zaryaCount} zarya's killed!`, "yellow", "black")
        }

        if (this.config.removeVog === true)
        {
          this.logger.log(`[kiki-ZaryaKiller] : ${vogCount} bot type's VOG's removed`, "yellow", "black")
        }

        if (this.config.removeImpact === true)
        {
          this.logger.log(`[kiki-ZaryaKiller] : ${impactCount} bot type's impacts removed`, "yellow", "black")
        }
      }
    }
  }
}

module.exports = {mod: new ZaryaKiller()}