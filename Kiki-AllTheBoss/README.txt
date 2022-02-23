This mod will give you the option of which bosses you want to spawn on each map.
The default settings give a 20% chance for every boss to spawn on each map and a 20% chance to spawn a raider and a rogue group.

Config explanation.

debug :  will output the newely calculated boss waves in the server log. (true / false)

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
