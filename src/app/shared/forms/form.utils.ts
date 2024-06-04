import { AbstractControl, FormGroup, FormArray, ValidationErrors } from '@angular/forms';
import { IMessage } from 'src/app/shared/services/message-handler/message-handler.service';
import { FormControlM3 } from './form-control/form-control-m3';

export function traverseControls(
    control: AbstractControl,
    name: string,
    action: (control: AbstractControl, name: string) => void
): void {
    if (control instanceof FormGroup) {
        Object.entries(control.controls).forEach(([childName, childControl]) =>
            traverseControls(childControl, childName, action)
        );
    } else if (control instanceof FormArray) {
        control.controls.forEach(childControl =>
            traverseControls(childControl, name, action)
        );
    } else {
        action(control, name);
    }
}

export function addWarning(form: FormGroup, formControlName: string, warningKey: string): void {
    const control = form.get(formControlName);
    if (control instanceof FormControlM3) {
        control.warnings = {
            ...control.warnings,
            [warningKey]: true
        };
        form.updateValueAndValidity({ emitEvent: true });
    }
}

export function clearAllWarnings(form: FormGroup, formControlName: string): void {
    const control = form.get(formControlName);
    if (control instanceof FormControlM3) {
        control.warnings = null;
        form.updateValueAndValidity({ emitEvent: true });
    }
}

export function messagesToValidationErrors(list: IMessage[], startWith: ValidationErrors | null): ValidationErrors | null {
    return list?.length > 0
        ? list.reduce(
            (prev, curr) => {
                prev[curr.text] = true;
                return prev;
            },
            startWith ?? {}
        )
        : startWith;
}

export function getRootFormPath(element: Element): string | null {
    const formEl = element.closest('form');
    return formEl?.getAttribute('path') ?? null;
}
