"use strict"

class RemoveTediousQuestConditions
{

  static onLoadMod()
  {

    const config = require("../config/config.json")
    const database = DatabaseServer.tables
    const quests = database.templates.quests
    const locales = database.locales.global.en.quest
    const conditionsToRemove = []
    const conditionFirstWord = [
      "Eliminate",
      "Headshot",
      "Make"
    ]
    const conditionTargetWord = [
      "while",
      "with",
      "without"
    ]

    //Recursive function that clears a given keys value to [] in a nested object.
    var keyClearer = function(object, key, questId)
    {

      if (Object.prototype.hasOwnProperty.call(object, key))
      {
        localesCleaner(questId)
        key !== "distance" ? object[key] = [] : object[key].value = 0
        
        if (config.debug === true)
        {
          Logger.log(`${quests[questId].QuestName}`, "green", "black")
        }
      }

      for (var i = 0; i < Object.keys(object).length; i++)
      {
        if (typeof object[Object.keys(object)[i]] == "object")
        {
          keyClearer(object[Object.keys(object)[i]], key, questId)
        }
      }
    }

    var removeLocations = function()
    {
      if (config.debug === true)
      {
        Logger.log(`\nLocations\n`, "green")
      }
      for (let eachQuest in quests)
      {
        for (let eachCondition in quests[eachQuest].conditions.AvailableForFinish)
        {
          let thisCondition = quests[eachQuest].conditions.AvailableForFinish[eachCondition]

          if (thisCondition._parent === "CounterCreator")
          {
            for (let condition = Object.keys(thisCondition._props.counter.conditions).length; condition--; condition < 0)
            {
              let finalCondition = thisCondition._props.counter.conditions[condition]

              if (finalCondition._parent === "Location")
              {
                thisCondition._props.counter.conditions.splice(condition, 1)
              }
            }
          }
        }
        if (config.debug === true)
        {
          Logger.log(quests[eachQuest].QuestName, "green")
        }
      }
    }

    var localesCleaner = function(questId)
    {

      for (let condition in locales[questId].conditions)
      {
        let thisCondition = locales[questId].conditions[condition].split(" ")

        if (conditionFirstWord.includes(thisCondition[0]))
        {
          let endWord = findEnd(thisCondition)
          locales[questId].conditions[condition] = thisCondition.slice(0, endWord).join(" ")
        }
      }
    }

    var findEnd = function(thisCondition)
    {

      for (let word of thisCondition)
      {
        if (conditionTargetWord.includes(word))
          return thisCondition.indexOf(word)
      }
    }

    for (let eachOption in config)
    {
      if (config[eachOption] != false)
      {
        switch (eachOption)
        {
          case "debug":
            break

          case "setPMC":
            quests["5a27c99a86f7747d2c6bdd8e"].conditions.AvailableForFinish[0]._props.counter.conditions[0]._props.target = "AnyPmc"
            break

          case "Location":
            removeLocations()
            break

          default:
            conditionsToRemove.push(eachOption)
            break
        }
      }
    }

    conditionsToRemove.forEach(condition =>
    {

      if (config.debug === true)
      {
        Logger.log(`\n${condition}\n`, "green", "black")
      }
      for (let eachQuest in quests)
      {
        keyClearer(quests[eachQuest], condition, eachQuest)
      }
    })
  }
}

module.exports = RemoveTediousQuestConditions