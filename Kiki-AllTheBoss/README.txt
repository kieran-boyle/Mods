This mod will give you the option of which bosses you want to spawn on each map.

The default config will set any bosses that normally spawn on the map to 100% with no other changes.

Config explanation.

BossConfig.

debug:  Will output the newely calculated boss waves in the server log. (true / false)
rebuildConfig: Will rebuild the config using the config builder, see config builder explanation section below for details. (true/false)
keepOriginalBossZones: Will limit the zones that the bosses can spawn to zones that can normally spawn a boss in each map. (true / false)
randomizeBossZonesEachRaid: When keepOriginalBossZones = false, Each boss gets set a single spawn zone, and the bosses are spread over the map.
	If randomizeBossZonesEachRaid is set to true then every time you complete a raid, the zone that each boss is assigned will be reselected.
	This will make make the locations each boss spawns different every raid. (true / false)
shuffleBossOrder: Will shuffle the order of the boss array (adds less predictability wth spawn order). (true / false)


maps :

	Has a list of maps with the following options.

		enabled : if true, will apply the following settings for the map. (true / false)

		Then for each boss : 
			amount : The amount of each boss to add to the spawn list. (number)
			chance : the chance that each boss added will spawn. (number 0 - 100)


HordeConfig explanation.

hordesEnabled : if true will apply horde settings. (true / false)

maps :

	Has a list of maps with the following options.

		enabled : if true, will apply the following settings for the map. (true / false)
		
		addRandomHorde : adds random hordes with the following settings

			enabled : if true, will apply the following settings for the map. (true / false)
			numberToGenerate : the number of boss hordes to generate. (number)
			minimumSupports : the minimum number of bosses to support the main boss (number)
			maximumSupports : the maximum number of bosses to support the main boss (number >= minimumSupports)

		bossList : A list of each boss, which will serve as the leader for each group, with the following options.

			amount : The amount of hordes to add. (number)
			chance : The chance for the horde to spawn. (number 0 - 100)
			escorts : Here you must put a list of the bosses you wish to spawn separated with comma's with no spaces.
				available options are Knight, Gluhar, Shturman, Sanitar, Reshala, Zryachiy, Kaban, Killa and Tagilla
				if you wanted Killa and Tagilla as escort you would put "Killa,Tagilla" for example (string)
			escortAmount : Here you must put a list of the number of each supporting boss to spawn separated with comma's with no spaces.
				following the above example, if you wanted 2 Killa and 4 Tagilla to support you would put "2,4" (string)


SubBossConfig explanation.

The config is split by map, and in each map, by sub boss.

Each set of options are as follows.

"remove": Remove this bot types original spawns from the map, if they exist. (true / false)
"add": {
	"enabled": Should we add more of this bot type to the map? (true / false),
	"amount": The amount to add,(number 0++)
	"chance": the chance for each group to spawn, (number 0 - 100)
	"time": The time in seconds to wait before trying to spawn, set to -1 to spawn instantly (number -1 || >0),
	"escortAmount": The number of followers in the group.  So for example if you wanted to spawn 3 Raiders then you would put 2 here.  This would give you the group leader and 2 followers, so a group of 3. (number 0++)
}

Config builder explanation.

As the config is quite large, I have built a method for generating configs with default settings.  It makes updating really simple when new boss types are added.
It pulls the data of what to generate from dictionaries.json (so for example, adding a new boss is as simple as adding it to dictionaries.bossDictionary and rebuilding the config.)
It sets the base state for all three configs in their respective scaffold.json which is located in the scaffolds folder.
Changing the settings in the scaffold, and changing rebuildConfig to true in bossConfig.json will first create a backup of all your current config settings, and save them in the backups folder.
Then it will set the base state for every repeated option to what has been set in the scaffold.
So for example, if I wanted 100% chance for all the bosses to spawn on all the maps, I would set the bossConfigScaffold to the following

{
  "debug": false,
  "keepOriginalBossZones": false,
  "randomizeBossZonesEachRaid": true,
  "shuffleBossOrder": true,
  "maps":
  {
    "enabled": true,
    "amount": 1,
    "chance": 100
  }
}

If you didnt want santa to spawn, you could then go through the conifg, and set just Santa's chance to 0.  Which is far quicker than having to set all the other bosses to 100 instead.
Some of you may find it handy for your initial setups.