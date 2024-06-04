import { FormControl, FormControlOptions, ValidationErrors } from '@angular/forms';
import { filter, map } from 'rxjs';

import { MessageHandlerService, MessageType } from 'src/app/shared/services/message-handler/message-handler.service';
import { GlobalInjectorService } from 'src/app/shared/services/global-injector/global-injector.service';
import { messagesToValidationErrors } from 'src/app/shared/forms/form.utils';

export class FormControlM3 extends FormControl {

    /**
     * Object containing any field warnings, or null if there are no warnings.
     */
    set warnings(warnings: ValidationErrors | null) {
        this._warnings = warnings;
        this.root.updateValueAndValidity();
    }
    get warnings(): ValidationErrors | null {
        return this._warnings;
    };

    private _warnings: ValidationErrors | null = null;
    private messageHandler: MessageHandlerService | undefined;

    constructor(value: string, public fieldName: string, public fieldLabel: string, opts?: FormControlOptions) {
        super(value, opts);
        this.setupMessageHandler();
    }

    private setupMessageHandler(): void {
        this.messageHandler = GlobalInjectorService.injectorInstance.get(MessageHandlerService);
        this.messageHandler.remoteMessages.pipe(
            filter(event => event?.messages?.length! > 0),
            map(event => event!.messages
                .filter(message => message.field === this.fieldName && message.text.length > 0)
            )
        ).subscribe(messages => {
            const errorList = messages!.filter(message => message.type === MessageType.ERROR);
            this.setErrors(messagesToValidationErrors(errorList, this.errors));

            const warningList = messages!.filter(message => message.type === MessageType.WARNING);
            this.warnings = messagesToValidationErrors(warningList, this.warnings);

            this.root.updateValueAndValidity();
        });
    }
}
