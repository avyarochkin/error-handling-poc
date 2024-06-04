import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { traverseControls } from '../../forms/form.utils';

export enum MessageType {
    ERROR,
    WARNING,
    INFO
}

export interface IMessage {
    type: MessageType;
    /** The name of the field the message applies to (e.g. zipCode), if applicable. */
    field?: string;
    /** The translated text to be shown to the end-user. */
    text: string;
}

export interface IMessageListEvent {
    formPath: string;
    messages: IMessage[];
}

@Injectable({
    providedIn: 'root'
})
export class MessageHandlerService {

    readonly remoteMessages = new Subject<IMessageListEvent | null>();

    validateForm(form: FormGroup, path: string): void {
        const messages: IMessage[] = [];
        traverseControls(form, '', (control, field) => {
            control.markAsTouched();
            control.markAsDirty();

            if (control.errors != null) {
                messages.push({
                    type: MessageType.ERROR,
                    field,
                    text: ''
                });
            }
        });
        this.remoteMessages.next({
            formPath: path,
            messages
        });
        form.root.updateValueAndValidity();
    }
}
