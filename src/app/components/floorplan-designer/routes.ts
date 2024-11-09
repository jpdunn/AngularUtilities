import { Route } from '@angular/router';
import { FloorplanDesignerComponent } from './floorplan-designer.component';

export default [
    {
        path: '',
        component: FloorplanDesignerComponent,
        canDeactivate: [(component: FloorplanDesignerComponent) => component.canDeactivate()],
    },
] satisfies Route[];
