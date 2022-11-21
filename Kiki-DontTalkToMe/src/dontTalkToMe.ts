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
        if((i === "assault" || i === "marksman") && this.config.botTypes.scav === true) this.shutUp(bots[i])
        if((i === "bear" || i === "usec" )&& this.config.botTypes.pmc === true) this.shutUp(bots[i])
        if(i === "cursedassault" && this.config.botTypes.raider === true) this.shutUp(bots[i])
        if(i === "exusec" && this.config.botTypes.rogue === true) this.shutUp(bots[i])
        if((i.includes("boss") || i === "sectantpriest" )&& this.config.botTypes.boss === true) this.shutUp(bots[i])
        if((i.includes("follower") || i === "sectantwarrior" ) && this.config.botTypes.follower === true) this.shutUp(bots[i])
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