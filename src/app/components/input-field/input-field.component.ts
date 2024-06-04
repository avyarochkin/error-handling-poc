import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { TextFieldTypes } from '@ionic/core';

import { FormControlM3 } from 'src/app/shared/forms/form-control/form-control-m3';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
    selector: 'app-input-field',
    templateUrl: './input-field.component.html',
    styleUrls: ['./input-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFieldComponent extends FormControlComponent {

    @Input() label: string | undefined;

    @Input() hint: string | undefined;

    @Input() type: TextFieldTypes = 'text';

    @ViewChild('ionInput') ionInput: IonInput | undefined;

    input(event: CustomEvent) {
        if (this.control?.updateOn !== 'blur') { return; }

        // hide all field errors on input
        if (!this.control.valid && this.control.dirty) {
            this.control.markAsUntouched();
            this.controlContainer.form.updateValueAndValidity();
        }
        // clear all warnings on input
        if (this.control instanceof FormControlM3) {
            this.control.warnings = null;
        }
    }

    async setValue(value: string): Promise<void> {
        if (this.ionInput != null) {
            this.ionInput.value = value;
            const inputEl = await this.ionInput.getInputElement();
            inputEl.dispatchEvent(new CustomEvent('input', { bubbles: true }));
        }
    }
}
