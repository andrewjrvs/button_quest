import { MessageData } from "./";
import { MessageRequestType } from "./message-request-type";

export interface MessageResponse {
    requestType: MessageRequestType;
    data: MessageData;
    status: boolean;
    messages: string[];
}
