import { ReceiverDto } from "./receiver.dto";
import { SenderDto } from "./sender.dto";

export class TxDto {
    sender: SenderDto;
    receiver: ReceiverDto;
}
