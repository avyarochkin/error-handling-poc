import { Injectable, Injector } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalInjectorService {

    static injectorInstance: Injector

    constructor(private readonly injector: Injector) {
        GlobalInjectorService.injectorInstance = injector;
        console.log('Global injector instance set.');
    }
}
