import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IMessage, MessageType } from 'src/app/shared/services/message-handler/message-handler.service';

@Component({
    selector: 'app-message-banner',
    templateUrl: './message-banner.component.html',
    styleUrls: ['./message-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageBannerComponent {

    @Input() message: IMessage | undefined;

    @Input() details: string[] | undefined;

    @Output() readonly dismiss = new EventEmitter<void>();

    readonly messageType: Record<MessageType, string> = {
        [MessageType.ERROR]: 'error',
        [MessageType.WARNING]: 'warning',
        [MessageType.INFO]: 'info'
    };

    readonly messageTypeIcon: Record<MessageType, string> = {
        [MessageType.ERROR]: 'warning-outline',
        [MessageType.WARNING]: 'alert-circle-outline',
        [MessageType.INFO]: 'information-circle-outline'
    };
}
