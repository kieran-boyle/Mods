import type { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class RemoveTediousQuestConditions implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger :ILogger
  private totals :string[] = []
  private loggerBuffer :string[] = []

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const quests = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.quests
    const conditionsToRemove :string[] = []    

    for (let eachOption in this.config)
    {
      if (this.config[eachOption] != false)
      {
        switch (eachOption)
        {
          case 'debug':
            break

          case 'setPMC':
            quests['5a27c99a86f7747d2c6bdd8e'].conditions.AvailableForFinish[0]._props.counter.conditions[0]._props.target = 'AnyPmc'
            break

          case 'Location':
          case 'InZone':
          case 'VisitPlace':
          case 'Shots':
          case 'HealthEffect':
            this.removeNested(eachOption, this.logger, quests)
            break

          default:
            conditionsToRemove.push(eachOption)
            break
        }
      }
    }

    conditionsToRemove.forEach(condition =>
    {

      if (this.config.debug === true) this.logger.log(`\n${condition}`, 'green', 'black')
      for (let eachQuest in quests) this.keyClearer(quests[eachQuest], condition, eachQuest, this.logger, quests)
      if (this.config.debug === true && this.loggerBuffer.length > 0) this.logger.log([... new Set(this.loggerBuffer)], 'green', 'black') 
      this.loggerBuffer = []  
    })
    console.log([...new Set(this.totals.flat())])
  }

  /**
   * Recursive function that clears a given keys value to [] in a nested object
   * @param object object to search thorugh
   * @param key key to find
   * @param questId questId for logging
   * @param logger ILogger
   * @param quests container/database/quests
   */
  private keyClearer(object :any, key :string, questId :string, logger :ILogger, quests :any):void
  {
    if (Object.prototype.hasOwnProperty.call(object, key))
    {
      key !== 'distance' ? object[key] = [] : object[key].value = 0
      this.loggerBuffer.push(quests[questId].QuestName)
    }

    for (var i = 0; i < Object.keys(object).length; i++)
    {
      if (typeof object[Object.keys(object)[i]] == 'object')
      {
        this.keyClearer(object[Object.keys(object)[i]], key, questId, logger, quests)
      }
    }  
  }

  /**
   * 
   * @param target 
   * @param logger ILogger
   * @param quests container/database/quests
   */
  private removeNested(target :string, logger :ILogger, quests: any):void
  {
    if (this.config.debug === true)
    {
      logger.log(`\n${target}`, 'green', 'black')      
    }
    
    for (let eachQuest in quests)
    {
      for (let eachCondition in quests[eachQuest].conditions.AvailableForFinish)
      {
        let thisCondition = quests[eachQuest].conditions.AvailableForFinish[eachCondition]

        if (thisCondition._parent === 'CounterCreator')
        {
          
          for (let condition = Object.keys(thisCondition._props.counter.conditions).length; condition--; condition < 0)
          {
            let finalCondition = thisCondition._props.counter.conditions[condition]
            this.totals.push(finalCondition._parent)
            if (finalCondition._parent === target)
            {
              thisCondition._props.counter.conditions.splice(condition, 1)
              this.loggerBuffer.push(quests[eachQuest].QuestName)
            }
          }
        }
      }      
    }
    if (this.config.debug === true && this.loggerBuffer.length > 0) logger.log([... new Set(this.loggerBuffer)], 'green', 'black')        
    this.loggerBuffer = []
  }
}

module.exports = {mod: new RemoveTediousQuestConditions()}