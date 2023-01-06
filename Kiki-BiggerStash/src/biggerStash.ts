import type { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class biggerStash implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger :ILogger

  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container    
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items
    const stashes = [
      "566abbc34bdc2d92178b4576", //Standard stash 10x28
      "5811ce572459770cba1a34ea", //Left Behind stash 10x38
      "5811ce662459770f6f490f32", //Prepare for escape stash 10x48
      "5811ce772459770e9e5f9532" //Edge of darkness stash 10x68
    ]    

    for (let stash of stashes)
    {
      let newSize = this.config.ChangeAll !== false ? this.config.ChangeAll : this.config[stash].size
      items[stash]._props.Grids[0]._props.cellsV = newSize
    
      if(this.config.debug === true)
        this.logger.log(`[kiki-BiggerStash] : ${this.config[stash].name} stash size changed to ${newSize}`, "yellow", "black")
    }    
  }
}
module.exports = {mod: new biggerStash()}