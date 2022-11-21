import { DependencyContainer } from "tsyringe"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class dontTalkToMe implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    const bots = this.container.resolve<DatabaseServer>('DatabaseServer').getTables().bots.types
    
    for(let i in bots)
    {
      if(this.config.muteAll === true)
      {
        this.shutUp(bots[i])
      }
      else
      {
        if(this.config.botTypes.follower === true && (i.includes("follower") || i === "sectantwarrior")) this.shutUp(bots[i])
        if(this.config.botTypes.boss === true && (i.includes("boss") || i === "sectantpriest")) this.shutUp(bots[i])
        if(this.config.botTypes.scav === true && (i === "assault" || i === "marksman")) this.shutUp(bots[i])
        if(this.config.botTypes.pmc === true && (i === "bear" || i === "usec")) this.shutUp(bots[i])
        if(this.config.botTypes.raider === true && i === "cursedassault") this.shutUp(bots[i])
        if(this.config.botTypes.rogue === true && i === "exusec") this.shutUp(bots[i])
      }      
    }
  }

  private shutUp(bot :any):void
  {
    for(let i in bot.difficulty)
    {
      bot.difficulty[i].Mind.CAN_TALK = false
    }
  }
}

module.exports = {mod: new dontTalkToMe()}