import path from "path"

export class configBuilder
{
   private config = require('../config/config.json')
   private hordeConfig = require('../config/hordeConfig.json')
   private dictionaries = require('../dictionaries/dictionaries.json')
   private configScaffold = require('../scaffolds/configScaffold.json')
   private hordeConfigScaffold = require('../scaffolds/hordeConfigScaffold.json')
   private fs = require('fs')
   
   public build()
   {
      const oldConfig = JSON.parse(JSON.stringify(this.config))
      const oldHordeConfig = JSON.parse(JSON.stringify(this.hordeConfig))

      this.generateBackups(oldConfig, oldHordeConfig)

      this.writeNewConfigs(this.generateConfig(), this.generateHordeConfig())
   }

   private generateConfig() 
   {
      const config = 
      {
        "debug": this.configScaffold.debug,
        "rebuildConfig": false,
        "keepOriginalBossZones": this.configScaffold.keepOriginalBossZones,
        "randomizeBossZonesEachRaid": this.configScaffold.randomizeBossZonesEachRaid,
        "shuffleBossOrder": this.configScaffold.shuffleBossOrder,
        "subBosses": {},
        "maps": {}
      }
    
      for (const subBossKey in this.dictionaries.subBossDictionary) 
      {
         config.subBosses[subBossKey] = {}

         const remove = `remove${subBossKey}`
         config.subBosses[subBossKey][remove] = this.configScaffold.subBosses.remove

         const boost = `boost${subBossKey}`
         config.subBosses[subBossKey][boost] = 
         {
            "enabled": this.configScaffold.subBosses.boost.enabled,
            "chance": this.configScaffold.subBosses.boost.chance,
            "time": this.configScaffold.subBosses.boost.time,
            "escortAmount": this.configScaffold.subBosses.boost.escortAmount
         }

         const add = `add${subBossKey}`
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
      return config
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
      return hordeConfig
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

   private generateBackups(oldConfig, oldHordeConfig)
   {
      const timestamp = Date.now()
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      const hours = ('0' + date.getHours()).slice(-2)
      const minutes = ('0' + date.getMinutes()).slice(-2)
      const seconds = ('0' + date.getSeconds()).slice(-2)

      const formattedDateTime = `${month}-${day} ${hours}h ${minutes}m ${seconds}s`;

      this.fs.mkdir(path.resolve(__dirname, `../backups/${formattedDateTime}`), (err) => 
      {
         if (err) throw err
      })

      this.fs.appendFile(path.resolve(__dirname, `../backups/${formattedDateTime}/config.json`), JSON.stringify(oldConfig, null, "\t"), (err) => 
      {
         if (err) throw err
      })

      this.fs.appendFile(path.resolve(__dirname, `../backups/${formattedDateTime}/hordeConfig.json`), JSON.stringify(oldHordeConfig, null, "\t"), (err) =>
      {
         if (err) throw err
      })
   }

   private writeNewConfigs(newConfig, newHordeConfig)
   {
      this.fs.writeFile(path.resolve(__dirname, '../config/config.json'), JSON.stringify(newConfig, null, "\t"), (err) => 
      { 
         if (err) throw (err)
      })

      this.fs.writeFile(path.resolve(__dirname, '../config/hordeConfig.json'), JSON.stringify(newHordeConfig, null, "\t"), (err) =>
      { 
         if (err) throw (err)
      })
   }
}