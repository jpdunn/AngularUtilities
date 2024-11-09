import { Component, ElementRef, EventEmitter, HostListener, Input, Output, TemplateRef } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CardAction } from './model/card-action.model';
import { Card } from './model/card.model';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltip } from '@angular/material/tooltip';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-card-layout',
    templateUrl: './card-layout.component.html',
    styleUrls: ['./card-layout.component.scss'],
    standalone: true,
    imports: [
        MatCardModule,
        RouterLink,
        MatIcon,
        MatChipsModule,
        MatTooltip,
        NgIf,
        NgFor,
        CommonModule,
        MatButton,
        RouterModule,
    ],
})
export class CardLayoutComponent {
    public selectedCard: Card | undefined;
    /**
     * The cards to be displayed.
     */
    @Input()
    public cards: Card[] = [];

    @Input()
    public customActionTemplate: TemplateRef<unknown> | undefined;

    @Output()
    public cardSelected: EventEmitter<Card | undefined>;

    constructor(private readonly router: Router, private eRef: ElementRef<HTMLElement>) {
        this.cardSelected = new EventEmitter<Card | undefined>();
    }

    /**
     * Fired when an action on a card is clicked.
     * @param action The action that was clicked.
     */
    public onActionClicked(action: CardAction): void {
        void this.router.navigate([action.route]);
    }

    public onClickCard(event: MouseEvent, card: Card) {
        this.toggleSelectedCard(card);
    }

    @HostListener('document:click', ['$event'])
    public clickout(event: MouseEvent) {
        // If clicked outside a card, then unselect a selection.
        let clickedACard = false;
        this.eRef.nativeElement.querySelectorAll('.card').forEach((x) => {
            if ((!clickedACard && x === event.target) || x.contains(event.target as Node)) {
                clickedACard = true;
            }
        });

        let maintainSelection = false;
        document.querySelectorAll('.keep-card-selection').forEach((x) => {
            if ((!maintainSelection && x == event.target) || x.contains(event.target as Node)) {
                maintainSelection = true;
            }
        });

        if (!clickedACard && !maintainSelection) {
            this.toggleSelectedCard(undefined);
        }
    }

    private toggleSelectedCard(card: Card | undefined) {
        if (!card || this.selectedCard === card) {
            this.selectedCard = undefined;
            this.cardSelected.emit(undefined);
        } else {
            this.selectedCard = card;
            this.cardSelected.emit(card);
        }
    }
}
