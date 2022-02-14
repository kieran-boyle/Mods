This mod will give you the option of which bosses you want to spawn on each map.
There is a new spawning method in place, Only 1 boss can be alive in a spawn zone at a time (and only spawnzones that have some internal flag set can even spawn bosses)
When you kill a boss, if there are still more to spawn, they will usually do so after a short delay.

Config explanation.

debug : (true / false). will show what the mod has done in the server log.

boostRaiders :
	enabled : if true, will apply the following 3 settings.
	chance : the chance that each raider group will spawn (0 - 100).
	time: if set to -1 it will spawn the raider groups as soon as the raid loads or button is pressed. otherwise will be the time after load / event that the group spawns.
	escortAmount : the number of raiders in each group.
	

then for each map,

enabled : (true / false) will the mod take effect on this map?

bossList[bossName] (0 - 100) the chance in % for the boss to spawn on that map.