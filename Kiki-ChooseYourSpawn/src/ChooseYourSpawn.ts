import { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class ChooseYourSpawn implements IPostDBLoadMod
{

  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger
  private bugFix = {
    "Id": "e17e24b8-476b-49d0-b420-d9f620bugfix",
    "Position":
    {
      "x": -28.50001,
      "y": 12.61,
      "z": 186.93
    },
    "Rotation": 88.80001,
    "Sides": [
      "All"
    ],
    "Categories": [
      "Player"
    ],
    "Infiltration": "Common",
    "DelayToCanSpawnSec": 4,
    "ColliderParams":
    {
      "_parent": "SpawnSphereParams",
      "_props":
      {
        "Center":
        {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "Radius": 30
      }
    },
    "BotZoneName": ""
  }
  private labsList = [
    '2f66dafc-a2f1-4283-a383-aa64c84f6da7', '63a12c08-6718-4344-b9c4-d9c2b0550faa', 'c40614b7-e0bc-4a8a-944d-bcaca72a32fb',
    'bcf0ec7f-9673-4fa1-aede-fdc6d6dd616b', '70a6af86-3b7a-4687-8128-ff324774cf6f', '666b38f8-c232-4b2e-994e-ead3b121990c',
    'd7eb2d80-10a1-48e1-b214-d7cac5eff13a', 'c9cb436b-9821-44ef-8ac8-fbef720f45d8', '5aed643f-3714-49fc-bdf8-00168189da61',
    'de98318f-4443-4cb1-92be-52e49fcdddd0', 'cfd895b4-b565-4c8a-a10b-ac2058b019af', '08633a18-3bbd-4a4b-934a-b51e049817b1',
    '242085cb-6ffa-4aa5-8268-dc8b138c7b74', '1d3d7178-c84f-47b2-9ea6-4cd11449dbfa', '9174a2bb-e647-40d2-9f27-b02bb4256e5a',
  ]

  public postDBLoad(container: DependencyContainer):void
  {
    this.container = container
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const locations = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().locations    

    for (const eachMap in this.config)
    {
      if (eachMap !== 'debug' && this.config[eachMap].enabled === true)
      {
        this.sortSpawns(eachMap, locations)
      }
    }
  }

  private sortSpawns(map :string, locations):void
  {
    //One of the clusters is missing a point (thanks BSG!) breaks the function, so created and pushed new point.
    if (map == "rezervbase")
    {
      locations[map].base.SpawnPointParams.push(this.bugFix)
    }

    let playerSpawns = () => locations[map].base.SpawnPointParams.filter(spawn => spawn.Categories.includes('Player'))
    let points = []
    let sorted = []
    let whitelist = []

    if (this.config.debug === true)
    {
      this.logger.log(`\n[Kiki-ChooseYourSpawn] : Initial number of player spawns = ${playerSpawns().length} on ${map}`, 'yellow', 'black')
    }

    for (let spawn of locations[map].base.SpawnPointParams)
    {

      if (spawn.Categories == "Player")
      {
        let temp = {}
        temp['Id'] = spawn.Id
        temp['Position'] = spawn.Position
        points.push(temp)
      }
    }

    points.sort((a, b) => a['Position'].x - b['Position'].x)

    for (let k = 0; k <= points.length; k++)
    {

      if (k % 5 === 0)
      {
        sorted.push(points.slice(k, k + 5))
      }
    }

    for (const [i, option] of Object.entries(this.config[map].spawns))
    {

      if (option === true)
      {
        map === 'laboratory' ?
          whitelist.push(this.labsList[i]) :
          whitelist.push(...(sorted[i].map((a) => a.Id))) // clever, thanks Kiubu.
      }
    }

    for (let i = locations[map].base.SpawnPointParams.length - 1; i >= 0; i--)
    {
      let spawn = locations[map].base.SpawnPointParams[i]

      if (!whitelist.includes(spawn.Id) && spawn.Categories.includes('Player'))
      {
        locations[map].base.SpawnPointParams.splice(i, 1)
      }
    }

    if (this.config.debug === true)
    {
      this.logger.log(`[Kiki-ChooseYourSpawn] : Final number of player spawns = ${playerSpawns().length} on ${map} \n`, 'yellow', 'black')
    }
  }
}

module.exports = {mod: new ChooseYourSpawn()}