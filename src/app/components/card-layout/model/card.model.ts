import { CardAction } from './card-action.model';
import { CardStatusSeverity } from './card-status-severity.model';

/**
 * Defines the data to be displayed in a card.
 */
export interface Card {
    /**
     * The title of the card.
     */
    title: string;

    /**
     * The status string to display.
     */
    status?: string;

    /**
     * Indicates the severity of status for colouring.
     */
     statusSeverity?: CardStatusSeverity;

    /**
     * The status string to display.
     */
     statusTooltip?: string

     /**
     * The subtitle to display.
     */
    subtitle: string;

    /**
     * The actions for the card, if any.
     */
    actions?: CardAction[];

    /**
     * The route to use to view the data behind the card.
     */
    viewRoute: string;

    /**
     * The route to use to edit the data behind the card.
     */
    editRoute?: string;

    /**
     * The context object to use with customActionTemlates.
     *
     * See https://angular.io/api/common/NgTemplateOutlet
     */
    customActionContext?: Record<string, unknown>;
}
