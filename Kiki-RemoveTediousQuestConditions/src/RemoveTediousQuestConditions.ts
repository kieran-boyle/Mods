import type { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class RemoveTediousQuestConditions implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger :ILogger
  private loggerBuffer :string[] = []

  public postDBLoad(container :DependencyContainer):void
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
            this.findCounterCreators(eachOption, quests)
            break

          default:
            conditionsToRemove.push(eachOption)
            break
        }
      }
    }

    conditionsToRemove.forEach(condition =>
    {
      if (this.config.debug === true) this.logger.info(`\n${condition}`)
      for (let eachQuest in quests) this.keyClearer(quests[eachQuest], condition, eachQuest, quests)
      if (this.config.debug === true && this.loggerBuffer.length > 0) this.logger.info([... new Set(this.loggerBuffer)])
      this.loggerBuffer = []  
    })
  }

  /**
   * Recursive function that clears a given keys value to [] in a nested object
   * @param object object to search thorugh
   * @param key key to find
   * @param questId questId for logging
   * @param quests container/database/quests
   */
  private keyClearer(object :any, key :string, questId :string, quests :any):void
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
        this.keyClearer(object[Object.keys(object)[i]], key, questId, quests)
      }
    }  
  }

  /**
   * Passes any quests with _parent of CounterCreator to removeNested()
   * @param target key to search for
   * @param quests container/database/quests
   */
  private findCounterCreators(target :string, quests :any):void
  {
    if (this.config.debug === true) this.logger.info(`\n${target}`)  
    
    for (let eachQuest in quests)
    {
      for (let eachCondition in quests[eachQuest].conditions.AvailableForFinish)
      {
        if(quests[eachQuest].conditions.AvailableForFinish[eachCondition]._parent === 'CounterCreator')
          this.removeNested(quests[eachQuest].conditions.AvailableForFinish[eachCondition], target, quests[eachQuest].QuestName)
      }      
    }
    if (this.config.debug === true && this.loggerBuffer.length > 0) this.logger.info([... new Set(this.loggerBuffer)])
    this.loggerBuffer = []
  }

  /**
   * Finds object with parent of target and removes
   * @param input each condition in CounterCreator
   * @param target the _parent condition to find
   * @param questName the name fo the quest for logging
   */
   private removeNested(input :any, target :string, questName :string):void 
   {
    let thisCondition = input._props.counter.conditions
    thisCondition.filter((finalCondition :any) => finalCondition._parent === target)
      .forEach((finalCondition :any) => 
      {
        thisCondition.splice(thisCondition.indexOf(finalCondition), 1)
        this.loggerBuffer.push(questName)
      })
  }
}

module.exports = {mod: new RemoveTediousQuestConditions()}