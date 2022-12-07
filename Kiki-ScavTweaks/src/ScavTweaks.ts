import { DependencyContainer } from "tsyringe"
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService"

class ScavTweaks implements IPreAkiLoadMod, IPostDBLoadMod
{

  private container: DependencyContainer
  private config = require("../config/config.json")

  public preAkiLoad(container: DependencyContainer):void
  {
    this.container = container
    const staticRouterModService = this.container.resolve<StaticRouterModService>("StaticRouterModService")
    staticRouterModService.registerStaticRouter(
      "ScavTweaks",
      [{
        url: "/raid/profile/save",
        action: (url :string, info :any, sessionId :string, output :string) => 
        {
          this.setSpawnDelay(info)
          return output
        }
      }],"aki")
  }
  
  private setSpawnDelay(info :any):void
  {
    const gConfig = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().globals.config
    if (info.isPlayerScav === true)
    {
      switch (info.exit)
      {
        case "survived":
          gConfig.SavagePlayCooldown = this.config.ScavTimeIfSurvive
          break

        case "runner":
          gConfig.SavagePlayCooldown = this.config.ScavTimeRunThrough
          break

        case "killed":
          gConfig.SavagePlayCooldown = this.config.ScavTimeDead
          break

        default:
          gConfig.SavagePlayCooldown = this.config.ScavTimeDead
          break
      }
    }
  }

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    const gConfig = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().globals.config
    gConfig.SavagePlayCooldown = this.config.ScavTimeDead
  }  
}

module.exports = {mod: new ScavTweaks()}