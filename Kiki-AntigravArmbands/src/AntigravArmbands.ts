import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class AntigravArmbands implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger

  public postDBLoad(container: DependencyContainer):void
  {

    this.container = container    
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const items = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items
    let armbands = [
      "5b3f16c486f7747c327f55f7",
      "5b3f3af486f774679e752c1f",
      "5b3f3b0186f774021a2afef7",
      "5b3f3ade86f7746b6b790d8e",
      "5b3f3b0e86f7746752107cda"
    ]

    armbands.forEach(band =>
    {
      items[band]._props.Weight = this.config[band].weight
      items[band]._props.StackMaxSize = this.config[band].stackSize

      if (this.config.debug === true)
      {
        this.logger.log(`[kiki-AntigravArmbands] : ${this.config[band].colour} armband gives ${this.config[band].weight} weight and stacksize is increased to ${this.config[band].stackSize}`, "yellow", "black")
      }
    })
  }
}

module.exports = {mod: new AntigravArmbands()}