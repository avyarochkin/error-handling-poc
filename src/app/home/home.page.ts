import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { MessageHandlerService } from 'src/app/shared/services/message-handler/message-handler.service';
import { FormControlM3 } from 'src/app/shared/forms/form-control/form-control-m3';
import { DataService } from 'src/app/shared/services/data/data-mock.service';
import * as FormUtils from 'src/app/shared/forms/form.utils';
import { IonPopover } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
    readonly form: FormGroup;

    showLoading = false;
    readonly formPath = 'testForm';
    readonly warnings = [
        { fieldName: 'email', fieldLabel: 'E-Mail', message: 'Email already used.' },
        { fieldName: 'phone', fieldLabel: 'Phone', message: 'Phone number not recognized.' },
        { fieldName: 'zipCode', fieldLabel: 'Postal code', message: 'Postal code not found.' }
    ];
    readonly countryItems = [
        { code: 'AU', title: 'Australia' },
        { code: 'CH', title: 'Switzerland' },
        { code: 'GB', title: 'United Kingdom' },
        { code: 'US', title: 'United States' }
    ];

    constructor(
        private readonly dataService: DataService,
        private readonly messageHandler: MessageHandlerService,
        private readonly cdr: ChangeDetectorRef
    ) {
        this.form = new FormGroup(
            {
                email: new FormControlM3('', 'email', 'E-Mail', {
                    validators: [Validators.required, Validators.email],
                    updateOn: 'blur'
                }),
                phone: new FormControlM3('', 'phone', 'Phone number', {
                    validators: [Validators.required, Validators.pattern(/\+?[0-9- ]+/)],
                    updateOn: 'blur'
                }),
                country: new FormControlM3('', 'country', 'Country', {
                    validators: [Validators.required],
                    updateOn: 'change'
                }),
                street: new FormArray([
                    new FormControlM3('', 'street', 'Street and house number', {
                        validators: [Validators.required],
                        updateOn: 'blur'
                    }),
                    new FormControlM3('', '', 'Street and house number', {
                        updateOn: 'blur'
                    })
                ]),
                zipCode: new FormControlM3('', 'zipCode', 'Postal code', {
                    updateOn: 'blur'
                }),
                additional: new FormGroup(
                    {
                        region: new FormControlM3('', 'region', 'Region', {
                            validators: [Validators.required],
                            updateOn: 'blur'
                        })
                    }, { updateOn: 'blur' }
                )
            },
            { updateOn: 'blur' }
        );
        (this.form.controls['additional'] as FormGroup).controls['region'].disable();
    }

    async submit(): Promise<void> {
        this.messageHandler.validateForm(this.form, this.formPath);
        if (!this.form.valid) { return; }
        this.showLoading = true;
        try {
            await firstValueFrom(this.dataService.submitData(this.form.value, this.formPath));
        } finally {
            this.showLoading = false;
            this.cdr.detectChanges();
        }
    }

    toggleAdditionalSection(event: CustomEvent<{ value: string }>) {
        console.log(event);
        if ((event.target as HTMLElement).id !== 'accordion-additional') { return; }
        const additionalGroup = this.form.controls['additional'] as FormGroup;
        const regionCtrl = additionalGroup.controls['region'];
        if (event.detail.value === 'additional') {
            regionCtrl.enable();
        } else {
            regionCtrl.disable();
        }
    }

    addWarning(formControlName: string, key: string, popover: IonPopover): void {
        popover?.dismiss();
        FormUtils.addWarning(this.form, formControlName, key);
    }

    clearAllWarnings(): void {
        for (const warning of this.warnings) {
            FormUtils.clearAllWarnings(this.form, warning.fieldName);
        }
    }

    loadFormData(): void {
        this.form.setValue({
            email: 'a@b.com',
            phone: '+41 234 567890',
            country: 'CH',
            street: ['Street name', 123],
            zipCode: '',
            additional: {
                region: ''
            }
        })
    }

    clearFormData(): void {
        this.form.reset()
    }

    markUntouched(ctrl: AbstractControl): void {
        ctrl.markAsUntouched();
        this.form.updateValueAndValidity({ emitEvent: true });
    }

    markPristine(ctrl: AbstractControl): void {
        ctrl.markAsPristine();
        this.form.updateValueAndValidity({ emitEvent: true });
    }
}
