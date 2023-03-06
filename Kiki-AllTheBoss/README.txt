This mod will give you the option of which bosses you want to spawn on each map.

Now multiple example config files are included!  Just copy whichever you wish to use over the configs folder,
and overwrite the existing files to use.
If you come up with a cool config please share it in the comments, or feel free to message it to me, I may include it in future releases.

The default config will set any bosses that normally spawn on the map to 100% with no other changes (this is the same as Standard Backup)
Spicy config give a 20% chance for every boss to spawn on each map, a 20% chance to spawn both a raider and a rogue group, and spawns a boss horde of between 3 and 7 bosses.
BossesWithFriends config will set any bosses that normally spawn on the map to 100% and they will bring a friend.
Horde config will spawn some custom made hordes to ruin your day (good example on building custom hordes)


Config explanation.

debug:  Will output the newely calculated boss waves in the server log. (true / false)
keepOriginalBossZones: Will limit the zones that the bosses can spawn to zones that can normally spawn a boss in each map. (true / false)
randomizeBossZonesEachRaid: When keepOriginalBossZones = false, Each boss gets set a single spawn zone, and the bosses are spread over the map.
	If randomizeBossZonesEachRaid is set to true then every time you complete a raid, the zone that each boss is assigned will be reselected.
	This will make make the locations each boss spawns different every raid. (true / false)
shuffleBossOrder: Will shuffle the order of the boss array (adds less predictability wth spawn order). (true / false)

Raiders and rogues are split into sections with the following options.

	removeRaiders / removeRogues :

		Removes the raiders and rogues present in the original boss waves. (true / false)

	boostRaiders / boostRogues:

		Boosts the following options of raiders / rogues that are in the original boss waves.

			enabled : if true, will apply the following 3 settings. (true / false)
			chance : the chance that each raider group will spawn. (0 - 100)
			time: if set to -1 it will spawn the raider groups as soon as the raid loads or button is pressed. 
				otherwise will be the time after load / event that the group spawns. (number)
			escortAmount : the number of raiders / rogues in each group. (number)
		
	addRaiders / addRogues

		Adds additional groups of Raiders / Rogues to the boss waves, with the following settings

			enabled : if true, will apply the following settings fop each map. (true / false)

			Then for each map.
				amount : the amount of groups to add. (number)
				chance : the chance that each  group will spawn. (number 0 - 100)
				time: if set to -1 it will spawn the groups as soon as the raid loads. 
					otherwise will be the time after load that the group spawns. (number) 
				escortAmount : the number of in each group. (number)


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
				available options are Knight, Gluhar, Shturman, Sanitar, Reshala, Zryachiy, Killa and Tagilla
				if you wanted Killa and Tagilla as escort you would put "Killa,Tagilla" for example (string)
			escortAmount : Here you must put a list of the number of each supporting boss to spawn separated with comma's with no spaces.
				following the above example, if you wanted 2 Killa and 4 Tagilla to support you would put "2,4" (string)
