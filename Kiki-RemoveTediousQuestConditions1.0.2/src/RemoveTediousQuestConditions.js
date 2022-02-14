"use strict"

const CONFIG = require("../config/config.json")

class RemoveTediousQuestConditions {

    static onLoadMod() {

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
        var keyClearer = function (object, key, questId) {

            if (Object.prototype.hasOwnProperty.call(object, key)) {
                localesCleaner(questId)
                key !== "distance" ? object[key] = [] : object[key].value = 0
            }

            for (var i = 0; i < Object.keys(object).length; i++) {
                if (typeof object[Object.keys(object)[i]] == "object")
                    keyClearer(object[Object.keys(object)[i]], key, questId)
            }
        }

        var localesCleaner = function (questId) {

            for (let condition in locales[questId].conditions) {
                let thisCondition = locales[questId].conditions[condition].split(" ")

                if (conditionFirstWord.includes(thisCondition[0])) {
                    let endWord = findEnd(thisCondition)
                    locales[questId].conditions[condition] = thisCondition.slice(0, endWord).join(" ")
                }
            }
        }

        var findEnd = function (thisCondition) {

            for (let word of thisCondition) {
                if (conditionTargetWord.includes(word))
                    return thisCondition.indexOf(word)
            }
        }

        for (let eachOption in CONFIG) {
            if (CONFIG[eachOption] != false) {
                switch (eachOption) {
                    case "setPMC":
                        quests["5a27c99a86f7747d2c6bdd8e"].conditions.AvailableForFinish[0]._props.counter.conditions[0]._props.target = "AnyPmc"
                        break

                    default:
                        conditionsToRemove.push(eachOption)
                        break
                }
            }
        }

        conditionsToRemove.forEach(condition => {
            for (let eachQuest in quests)
                keyClearer(quests[eachQuest], condition, eachQuest)
        })
    }
}

module.exports = RemoveTediousQuestConditions