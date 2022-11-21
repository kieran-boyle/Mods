import { DependencyContainer } from "tsyringe"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class dontTalkToMe implements IPostDBLoadMod
{
  private container: DependencyContainer

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    const bots = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().bots.types

    for(let i in bots)
    {
      for(let j in bots[i].difficulty)
      {
        let bot = bots[i].difficulty[j]
        bot.Mind.CAN_TALK = false
      }
    }
  }
}

module.exports = {mod: new dontTalkToMe()}