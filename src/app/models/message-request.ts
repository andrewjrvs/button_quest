import { MessageRequestType } from "./message-request-type";
import { Actor, Item } from "./";
import { Sack } from "./sack";

export interface MessageData {
    bank?: Sack;
    isCustomBank?: boolean;
    primary: Actor[];
    secondary?: Actor[];
    force?: boolean;
    item?: Item;
}

export interface MessageRequest {
    type: MessageRequestType;
    data: MessageData
    
}