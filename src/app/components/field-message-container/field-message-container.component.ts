import { ChangeDetectionStrategy, Component } from '@angular/core';

import { zoomHeight } from 'src/app/shared/animations';
import { validatorErrors } from './field-message-container.const';
import { FormControlComponent } from '../form-control/form-control.component';


@Component({
    selector: 'app-field-message-container',
    templateUrl: './field-message-container.component.html',
    styleUrls: ['./field-message-container.component.scss'],
    animations: [zoomHeight],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldMessageContainerComponent extends FormControlComponent {

    getErrorText(errorKey: string): string {
        return validatorErrors[errorKey] ?? errorKey;
    }
}
