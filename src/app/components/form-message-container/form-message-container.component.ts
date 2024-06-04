import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { filter } from 'rxjs/operators';

import { MessageHandlerService, IMessage, MessageType, IMessageListEvent } from 'src/app/shared/services/message-handler/message-handler.service';
import { getRootFormPath, traverseControls } from 'src/app/shared/forms/form.utils';
import { FormControlM3 } from 'src/app/shared/forms/form-control/form-control-m3';
import { zoomHeight } from 'src/app/shared/animations';

@Component({
    selector: 'app-form-message-container',
    templateUrl: './form-message-container.component.html',
    styleUrls: ['./form-message-container.component.scss'],
    animations: [zoomHeight]
})
export class FormMessageContainerComponent implements OnInit {

    protected formMessages: IMessage[] | undefined;
    protected readonly fieldMessage: IMessage = { type: MessageType.ERROR, text: 'Correct field errors' };
    protected fieldMessageDetails: string[] | undefined;
    private formPath: string | null = null;

    constructor(
        private readonly controlContainer: FormGroupDirective,
        private readonly messageHandler: MessageHandlerService,
        private readonly hostElementRef: ElementRef
    ) { }

    ngOnInit(): void {
        this.formPath = getRootFormPath(this.hostElementRef.nativeElement);
        this.messageHandler.remoteMessages
            .pipe(filter(event => this.formPath == null || event?.formPath === this.formPath))
            .subscribe(event => {
                this.updateFormMessages(event);
                this.updateFieldMessages(this.controlContainer.form);
            });
    }

    dismissFormMessage(messageIndex: number): void {
        this.formMessages = this.formMessages?.filter((_, index) => index !== messageIndex);
    }

    dismissFieldMessage(): void {
        this.fieldMessageDetails = undefined;
    }

    private updateFormMessages(event: IMessageListEvent | null): void {
        this.formMessages = event?.messages
            ?.filter(message => message.field == null);
    }

    private updateFieldMessages(form: FormGroup | null): void {
        if (form == null) { return; }
        this.fieldMessageDetails = undefined;
        traverseControls(form, '', (control) => {
            if (control.errors != null) {
                if (control instanceof FormControlM3 && control.fieldLabel?.length > 0) {
                    this.fieldMessageDetails = [
                        ...this.fieldMessageDetails ?? [],
                        control.fieldLabel
                    ];
                }
            }
        });
    }
}
