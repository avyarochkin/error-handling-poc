import { Injectable } from '@angular/core';
import { MessageHandlerService, IMessage, MessageType } from '../message-handler/message-handler.service';
import { Observable, tap, timer } from 'rxjs';
import { ToastController } from '@ionic/angular';

const addressUnknown = {
    type: MessageType.ERROR,
    text: 'Address not found. Is postal code missing?'
};
const countryNotSupported = {
    type: MessageType.ERROR,
    field: 'phone',
    text: 'Phone country not supported. Did you try a US number?'
};
const emailCompromised = {
    type: MessageType.WARNING,
    field: 'email',
    text: 'Email compromised. The length is too short.'
};
const regionTooShort = {
    type: MessageType.ERROR,
    field: 'region',
    text: 'Region name too short. Enter 5 characters or more.'
};

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(
        private readonly messageHandler: MessageHandlerService,
        private readonly toast: ToastController
    ) { }

    submitData(formData: object, formPath: string): Observable<unknown> {
        console.log('SUBMITTED', formData);

        return timer(1000).pipe(
            tap(() => {
                const messages: IMessage[] = [];
                if ('zipCode' in formData && typeof formData.zipCode === 'string' && formData.zipCode.trim().length === 0) {
                    messages.push(addressUnknown);
                }
                if ('phone' in formData && typeof formData.phone === 'string' && !formData.phone.trim().startsWith('+1')) {
                    messages.push(countryNotSupported);
                }
                if ('email' in formData && typeof formData.email === 'string' && formData.email.length < 8) {
                    messages.push(emailCompromised)
                }
                if ('additional' in formData && typeof formData.additional === 'object') {
                    if ('region' in formData.additional! && typeof formData.additional.region === 'string' && formData.additional.region.trim().length < 5) {
                        messages.push(regionTooShort)
                    }
                }

                const errorMessages = messages.filter(message => message.type === MessageType.ERROR);
                if (errorMessages.length > 0) {
                    this.messageHandler.remoteMessages.next({ formPath, messages });
                } else {
                    this.showToast('Saved successfully');
                }
            })
        );
    }

    private async showToast(text: string): Promise<void> {
        const toast = await this.toast.create({
            duration: 2000,
            icon: 'checkmark',
            message: text,
            position: 'top', color: 'dark'
        });
        await toast.present();
    }
}
