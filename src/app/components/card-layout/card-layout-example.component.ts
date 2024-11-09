import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Card } from './model/card.model';
import { CardLayoutComponent } from './card-layout.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    template: `<app-card-layout
            [cards]="cards"
            (cardSelected)="onCardSelected($event)"
            [customActionTemplate]="customActions"
        ></app-card-layout>

        <ng-template #customActions let-facility>
            <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu backdropClass="keep-card-selection" #menu="matMenu">
                <button mat-menu-item>
                    <span>Do Something</span>
                </button>
                <button mat-menu-item>
                    <span>Do Something Else</span>
                </button>
            </mat-menu>
        </ng-template> `,
    styles: `:host{ 
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }`,
    imports: [MatButton, CardLayoutComponent, MatMenuModule, MatIcon, MatMenuTrigger, CommonModule],
})
export class CardLayoutExampleComponent {
    public cards: Card[] = [
        {
            title: 'Floorplanner',
            subtitle: 'For when you want to...plan floors?',
            viewRoute: '/floorplan-designer',
        },
        {
            title: 'Image Uploader',
            subtitle: 'Upload your favourite images',
            viewRoute: '/image-uploader',
        },
        {
            title: '404 Page',
            subtitle: 'Displays an example 404 page',
            viewRoute: '/not-found',
        },
        {
            title: 'Signature Pad',
            subtitle: 'Sign your life away',
            viewRoute: '/signature-pad',
        },
        {
            title: 'Banner',
            subtitle: 'Big banner for critical information',
            viewRoute: '/banner',
        },
    ];

    public onCardSelected(card: Card | undefined) {
        console.log('card selected: ', card);
    }
}
