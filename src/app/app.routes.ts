import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SignaturePadComponent } from './components/signature-pad/signature-pad.component';
import { CardLayoutExampleComponent } from './components/card-layout/card-layout-example.component';
import { BannerExampleComponent } from './components/banner/banner-example.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'floorplan-designer',
        loadChildren: () => import('./components/floorplan-designer/routes'),
    },
    {
        path: 'image-uploader',
        loadChildren: () => import('./components/upload-image-dialog/routes'),
    },
    { path: 'signature-pad', component: SignaturePadComponent },
    { path: 'card-layout', component: CardLayoutExampleComponent },
    { path: 'banner', component: BannerExampleComponent },
    { path: 'not-found', component: NotFoundComponent },
];
