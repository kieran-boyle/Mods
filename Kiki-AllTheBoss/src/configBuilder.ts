import path from "path"

export class configBuilder
{
   private bossConfig = require('../config/bossConfig.json')
   private hordeConfig = require('../config/hordeConfig.json')
   private subBossConfig = require('../config/subBossConfig.json')
   private dictionaries = require('../dictionaries/dictionaries.json')
   private bossConfigScaffold = require('../scaffolds/bossConfigScaffold.json')
   private hordeConfigScaffold = require('../scaffolds/hordeConfigScaffold.json')
   private subBossConfigScaffold = require('../scaffolds/subBossConfigScaffold.json')
   private fs = require('fs')
   
   public build()
   {
      const oldConfig = JSON.parse(JSON.stringify(this.bossConfig))
      const oldHordeConfig = JSON.parse(JSON.stringify(this.hordeConfig))
      const oldSubBossConfig = JSON.parse(JSON.stringify(this.subBossConfig))

      this.generateBackups(oldConfig, oldHordeConfig, oldSubBossConfig)

      this.writeNewConfigs(this.generateBossConfig(), this.generateHordeConfig(), this.generateSubBossConfig())
   }
   
   private generateBossConfig() 
   {
      const config = 
      {
        "debug": this.bossConfigScaffold.debug,
        "rebuildConfig": false,
        "keepOriginalBossZones": this.bossConfigScaffold.keepOriginalBossZones,
        "randomizeBossZonesEachRaid": this.bossConfigScaffold.randomizeBossZonesEachRaid,
        "shuffleBossOrder": this.bossConfigScaffold.shuffleBossOrder,
        "maps": {}
      }

      for(const map in this.dictionaries.mapDictionary)
      {
         config.maps[map] =
         {
            "enabled": this.bossConfigScaffold.maps.enabled,
            "bossList": this.generateBossList()
         }
      }
      return config
   }

   private generateSubBossConfig()
   {
      const config = 
      {
         "maps": {}
      }

      for(const map in this.dictionaries.mapDictionary)
      {
         config.maps[map] = {}
         for(const subBoss in this.dictionaries.subBossDictionary)
         {
            config.maps[map][subBoss] = this.addSubBosses()
         }         
      }
      return config
   }

   private addSubBosses()
   {
      const subObj =
      {
         "remove": this.subBossConfigScaffold.maps.remove,
         "add":
         {            
            "enabled": this.subBossConfigScaffold.maps.add.enabled,
            "amount": this.subBossConfigScaffold.maps.add.chance,
            "chance": this.subBossConfigScaffold.maps.add.chance,
            "time": this.subBossConfigScaffold.maps.add.time,
            "escortAmount": this.subBossConfigScaffold.maps.add.escortAmount            
         }
      }
      return subObj
   }

   private generateBossList()
   {
      const bosses = {}
      for(const boss in this.dictionaries.bossDictionary)
      {
         bosses[boss] =
         {
            "amount": this.bossConfigScaffold.maps.amount,
            "chance": this.bossConfigScaffold.maps.chance
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

   private generateBackups(oldBossConfig, oldHordeConfig, oldSubBossConfig)
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

      this.fs.appendFile(path.resolve(__dirname, `../backups/${formattedDateTime}/bossConfig.json`), JSON.stringify(oldBossConfig, null, "\t"), (err) => 
      {
         if (err) throw err
      })

      this.fs.appendFile(path.resolve(__dirname, `../backups/${formattedDateTime}/hordeConfig.json`), JSON.stringify(oldHordeConfig, null, "\t"), (err) =>
      {
         if (err) throw err
      })

      this.fs.appendFile(path.resolve(__dirname, `../backups/${formattedDateTime}/subBossConfig.json`), JSON.stringify(oldSubBossConfig, null, "\t"), (err) =>
      {
         if (err) throw err
      })
   }

   private writeNewConfigs(newConfig, newHordeConfig, newSubBossConfig)
   {
      this.fs.writeFile(path.resolve(__dirname, '../config/bossConfig.json'), JSON.stringify(newConfig, null, "\t"), (err) => 
      { 
         if (err) throw (err)
      })

      this.fs.writeFile(path.resolve(__dirname, '../config/hordeConfig.json'), JSON.stringify(newHordeConfig, null, "\t"), (err) =>
      { 
         if (err) throw (err)
      })

      this.fs.writeFile(path.resolve(__dirname, '../config/subBossConfig.json'), JSON.stringify(newSubBossConfig, null, "\t"), (err) =>
      { 
         if (err) throw (err)
      })
   }
}