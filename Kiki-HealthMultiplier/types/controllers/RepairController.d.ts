import { QuestHelper } from "../helpers/QuestHelper";
import { RepairHelper } from "../helpers/RepairHelper";
import { TraderHelper } from "../helpers/TraderHelper";
import { IPmcData } from "../models/eft/common/IPmcData";
import { IItemEventRouterResponse } from "../models/eft/itemEvent/IItemEventRouterResponse";
import { IRepairActionDataRequest } from "../models/eft/repair/IRepairActionDataRequest";
import { ITraderRepairActionDataRequest } from "../models/eft/repair/ITraderRepairActionDataRequest";
import { IRepairConfig } from "../models/spt/config/IRepairConfig";
import { ILogger } from "../models/spt/utils/ILogger";
import { ItemEventRouter } from "../routers/ItemEventRouter";
import { DatabaseServer } from "../servers/DatabaseServer";
import { PaymentService } from "../services/PaymentService";
import { RepairService } from "../services/RepairService";
export declare class RepairController {
    protected logger: ILogger;
    protected itemEventRouter: ItemEventRouter;
    protected databaseServer: DatabaseServer;
    protected questHelper: QuestHelper;
    protected traderHelper: TraderHelper;
    protected paymentService: PaymentService;
    protected repairHelper: RepairHelper;
    protected repairService: RepairService;
    protected repairConfig: IRepairConfig;
    constructor(logger: ILogger, itemEventRouter: ItemEventRouter, databaseServer: DatabaseServer, questHelper: QuestHelper, traderHelper: TraderHelper, paymentService: PaymentService, repairHelper: RepairHelper, repairService: RepairService);
    /**
     * Repair with trader
     * @param sessionID session id
     * @param body endpoint request data
     * @param pmcData player profile
     * @returns item event router action
     */
    traderRepair(sessionID: string, body: ITraderRepairActionDataRequest, pmcData: IPmcData): IItemEventRouterResponse;
    /**
     * Repair with repair kit
     * @param sessionID session id
     * @param body endpoint request data
     * @param pmcData player profile
     * @returns item event router action
     */
    repairWithKit(sessionID: string, body: IRepairActionDataRequest, pmcData: IPmcData): IItemEventRouterResponse;
}
