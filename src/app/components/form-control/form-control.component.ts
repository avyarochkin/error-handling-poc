import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { filter, merge } from 'rxjs';

import { FormControlM3 } from 'src/app/shared/forms/form-control/form-control-m3';
import { getRootFormPath } from 'src/app/shared/forms/form.utils';
import { MessageHandlerService } from 'src/app/shared/services/message-handler/message-handler.service';

@Component({
    template: ''
})
export abstract class FormControlComponent implements OnInit {

    @Input() name: string | undefined;

    get control(): AbstractControl | null {
        // lazy binding
        if (this._control == null) {
            this._control = this.name != null
                ? this.controlContainer.form?.get(this.name)
                : null;
        }
        return this._control;
    }

    get extControl(): FormControlM3 | null {
        return this.control instanceof FormControlM3
            ? this.control
            : null;
    }

    get hasWarnings(): boolean {
        return this.extControl?.warnings != null;
    }

    private _control: AbstractControl | null = null;
    private formPath: string | null = null;

    constructor(
        protected readonly controlContainer: FormGroupDirective,
        protected readonly messageHandler: MessageHandlerService,
        protected readonly hostElementRef: ElementRef,
        protected readonly cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.formPath = getRootFormPath(this.hostElementRef.nativeElement);
        const fieldName = this.extControl?.fieldName;
        const remoteMessages = this.messageHandler.remoteMessages!.pipe(
            filter(event =>
                (this.formPath == null || event!.formPath === this.formPath) &&
                (fieldName == null || event!.messages.some(message => message.field === fieldName))
            )
        );
        merge(
            remoteMessages,
            this.controlContainer.form.root.statusChanges!
        ).subscribe(() => {
            this.cdr.markForCheck();
        });
    }
}
