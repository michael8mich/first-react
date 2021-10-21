import { AdminActionCreators } from "./admin/action-creators";
import { AuthActionCreators } from "./auth/action-creators";
import { CacheActionCreators } from "./cache/action-creators";
import { EventActionCreators } from "./event/action-creators";
import { TicketActionCreators } from "./ticket/action-creators";

export const allActionCreators = {
    ...AuthActionCreators,
    ...EventActionCreators,
    ...AdminActionCreators,
    ...CacheActionCreators,
    ...TicketActionCreators
}