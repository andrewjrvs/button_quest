import { MessageRequestType } from "./message-request-type";
import { Bank, Actor } from "./";

export interface MessageData {
    bank?: Bank;
    primary: Actor[];
    secondary?: Actor[];
    force?: boolean;
}

export interface MessageRequest {
    type: MessageRequestType;
    data: MessageData
    
}