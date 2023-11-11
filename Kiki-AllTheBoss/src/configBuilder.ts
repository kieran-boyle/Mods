export class configBuilder
{
   private config = require('../config/config.json')
   private hordeConfig = require('../config/hordeConfig.json')
   private dictionaries = require('../dictionaries/dictionaries.json')
   private configScaffold = require('../scaffolds/configScaffold.json')
   private hordeConfigScaffold = require('../scaffolds/hordeConfigScaffold.json')
   
   public build()
   {
      console.log("building")
      this.generateConfig()
      this.generateHordeConfig()
   }

   private generateConfig() 
   {
      const config = {
        "debug": this.configScaffold.debug,
        "keepOriginalBossZones": this.configScaffold.keepOriginalBossZones,
        "randomizeBossZonesEachRaid": this.configScaffold.randomizeBossZonesEachRaid,
        "shuffleBossOrder": this.configScaffold.shuffleBossOrder,
        "subBosses": {},
        "maps": {}
      }
    
      for (const subBossKey in this.dictionaries.subBossDictionary) 
      {
         config.subBosses[subBossKey] = {}

         let remove = `remove${subBossKey}`
         config.subBosses[subBossKey][remove] = this.configScaffold.subBosses.remove

         let boost = `boost${subBossKey}`
         config.subBosses[subBossKey][boost] = 
         {
            "enabled": this.configScaffold.subBosses.boost.enabled,
            "chance": this.configScaffold.subBosses.boost.chance,
            "time": this.configScaffold.subBosses.boost.time,
            "escortAmount": this.configScaffold.subBosses.boost.escortAmount
         }

         let add = `add${subBossKey}`
         config.subBosses[subBossKey][add] =
         {
            "enabled": this.configScaffold.subBosses.add.enabled,
            "maps": this.generateSubBossMaps()
         }
      }

      for(const map in this.dictionaries.mapDictionary)
      {
         config.maps[map] =
         {
            "enabled": this.configScaffold.maps.enabled,
            "bossList": this.generateBossList()
         }
      }
      //console.log(JSON.stringify(config, null, 1))
   }

   private generateSubBossMaps()
   {
      const maps = {}
      for(const map in this.dictionaries.mapDictionary)
      {
         maps[map] = 
         {
            "amount": this.configScaffold.subBosses.add.amount,
            "chance": this.configScaffold.subBosses.add.chance,
            "time": this.configScaffold.subBosses.add.time,
            "escortAmount": this.configScaffold.subBosses.add.escortAmount
         }
      }
      return maps
   }

   private generateBossList()
   {
      const bosses = {}
      for(const boss in this.dictionaries.bossDictionary)
      {
         bosses[boss] =
         {
            "amount": this.configScaffold.maps.amount,
            "chance": this.configScaffold.maps.chance
         }
      }
      return bosses
   }

   private generateHordeConfig()
   {
      const hordeConfig = 
      {
         "hordesEnabled": this.hordeConfigScaffold.hordesEnabled,
         "maps":{}
      }
      for(const map in this.dictionaries.mapDictionary)
      {
         hordeConfig.maps[map] = 
         {
         "enabled": this.hordeConfigScaffold.maps.enabled,
         "addRandomHorde": 
         {
            "enabled": this.hordeConfigScaffold.maps.addRandomHorde.enabled,
            "numberToGenerate": this.hordeConfigScaffold.maps.addRandomHorde.numberToGenerate,
            "minimumSupports": this.hordeConfigScaffold.maps.addRandomHorde.minimumSupports,
            "maximumSupports": this.hordeConfigScaffold.maps.addRandomHorde.maximumSupports
         },
         "bossList": this.generateHordeBossList()
         }
      }
      //console.log(JSON.stringify(hordeConfig, null, 1))
   }

   private generateHordeBossList()
   {
      const bossList= {}
      for(const boss in this.dictionaries.bossDictionary)
      {
         bossList[boss] =
         {
         "amount": this.hordeConfigScaffold.maps.bossList.amount,
         "chance": this.hordeConfigScaffold.maps.bossList.chance,
         "escorts": this.hordeConfigScaffold.maps.bossList.escorts,
         "escortAmount": this.hordeConfigScaffold.maps.bossList.escortAmount
         }
      }
      return bossList
   }
}