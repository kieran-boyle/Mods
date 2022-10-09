import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class biggerStash implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger;

  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container    
    this.logger = this.container.resolve<ILogger>("WinstonLogger");
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items
    const stashes = [
      "566abbc34bdc2d92178b4576", //Standard stash 10x28
      "5811ce572459770cba1a34ea", //Left Behind stash 10x38
      "5811ce662459770f6f490f32", //Prepare for escape stash 10x48
      "5811ce772459770e9e5f9532" //Edge of darkness stash 10x68
    ]

    if (this.config.ChangeAll !== false)
    {

      for (let stash of stashes)
      {
        items[stash]._props.Grids[0]._props.cellsV = this.config.ChangeAll
      }
      this.logger.log(`[kiki-BiggerStash] : All stash sizes changed to ${this.config.ChangeAll}`, "yellow", "black")
    }
    else
    {

      for (let stash of stashes)
      {
        items[stash]._props.Grids[0]._props.cellsV = this.config[stash].size
        this.logger.log(`[kiki-BiggerStash] : ${this.config[stash].name} stash size changed to ${this.config[stash].size}`, "yellow", "black")
      }
    }
  }
}
module.exports = {mod: new biggerStash()}