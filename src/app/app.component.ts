import { Component, inject } from '@angular/core';
import { GlobalInjectorService } from './shared/services/global-injector/global-injector.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor() {
        inject(GlobalInjectorService)
    }
}
