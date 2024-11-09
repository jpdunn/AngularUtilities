import { Component } from '@angular/core';
import { BannerComponent } from './banner.component';

@Component({
    standalone: true,
    template: `<app-banner
        text="This is a big banner to draw attention to something (for example service outages)."
        status="caution"
        tone="strong"
    ></app-banner> `,
    imports: [BannerComponent],
})
export class BannerExampleComponent {}
