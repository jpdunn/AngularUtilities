/**
 * Defines an action that can be displayed in a card.
 */
export interface CardAction {
    /**
     * The route to navigate to when the action is triggered.
     */
    route: string;

    /**
     * The icon to display.
     */
    icon: string;
}
