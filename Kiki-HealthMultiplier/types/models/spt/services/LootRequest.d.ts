import { MinMax } from "../../common/MinMax";
export declare class LootRequest {
    presetCount: MinMax;
    itemCount: MinMax;
    itemBlacklist: string[];
    itemTypeWhitelist: string[];
    /** key: item base type: value: max count */
    itemLimits: Record<string, number>;
    armorLevelWhitelist: number[];
    moneyStackLimits: Record<string, MinMax>;
}
