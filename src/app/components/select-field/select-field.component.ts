import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormControlComponent } from '../form-control/form-control.component';
import { IonSelect } from '@ionic/angular';

export interface ListItem<T = string, D = unknown> {
    /** Optional item type; if not present, defaults to `SELECTABLE` */
    // type?: ListItemType;
    /** Unique key value of this item */
    code: T;
    /** Title string. Searchable. */
    title: string;
    /** Optional subtitle string. Searchable */
    subtitle?: string;
    /** Name of optional icon */
    iconName?: string;
    /** Optional indicator to render this item as _destructive_ */
    destructive?: boolean;
    /** Optional warning message string */
    message?: string;
    /** Additional data linked to the item (if required) */
    data?: D;
    /** Checks sets the disabled state of the item */
    disabled?: boolean;
}

@Component({
    selector: 'app-select-field',
    templateUrl: './select-field.component.html',
    styleUrls: ['./select-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFieldComponent extends FormControlComponent {
    @Input() label: string | undefined;
    @Input() items: ListItem[] | undefined;

    @ViewChild('ionSelect') ionSelect: IonSelect | undefined;

    openList() {
        if (this.ionSelect != null) {
            this.ionSelect.open();
        }
    }

    clearValue(event: MouseEvent): void {
        this.ionSelect!.value = null;
        this.control!.setValue('');
        this.control!.markAsTouched();
        this.control!.markAsDirty();
        event.preventDefault();
        event.stopPropagation();
        this.cdr.markForCheck();
    }
}
