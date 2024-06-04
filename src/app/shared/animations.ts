import { trigger, transition, style, animate, animation } from '@angular/animations';

export const zoomHeight = trigger('zoomHeight', [
    transition(':enter', [
        animation([
            style({
                height: 0,
                opacity: 0,
                transform: 'scale3d(0.5, 0.5, 1)'
            }),
            animate('100ms ease-out',
                style({
                    height: '*',
                    opacity: 1,
                    transform: '*'
                })
            )
        ])
    ]),
    transition(':leave', [
        animation([
            animate('150ms ease-out',
                style({
                    height: 0,
                    opacity: 0,
                    transform: 'scale3d(0.5, 0.5, 1)'
                })
            )
        ])
    ])
])
