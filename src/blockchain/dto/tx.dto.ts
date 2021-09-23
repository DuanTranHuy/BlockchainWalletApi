import { ReceiverDto } from "./receiver.dto";
import { SenderDto } from "./sender.dto";

export class TxDto {
    senders: SenderDto[];
    receivers: ReceiverDto[];
}
