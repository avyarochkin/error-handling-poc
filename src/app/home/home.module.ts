import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { FieldMessageContainerComponent } from '../components/field-message-container/field-message-container.component';
import { InputFieldComponent } from '../components/input-field/input-field.component';
import { MessageBannerComponent } from '../components/message-banner/message-banner.component';
import { FormMessageContainerComponent } from '../components/form-message-container/form-message-container.component';
import { SelectFieldComponent } from '../components/select-field/select-field.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        HomePageRoutingModule
    ],
    declarations: [
        HomePage,
        FieldMessageContainerComponent,
        MessageBannerComponent,
        FormMessageContainerComponent,
        InputFieldComponent,
        SelectFieldComponent
    ]
})
export class HomePageModule {}
