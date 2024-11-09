import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIcon],
})
export class BannerComponent {
    @Input()
    public text = '';

    @Input()
    public icon = 'info';

    @Input()
    public status: 'warning' | 'info' | 'caution' | 'success' = 'info';

    @Input()
    public tone: 'light' | 'strong' = 'light';

    public get bannerClass() {
        return {
            'banner-warning': this.status === 'warning',
            'banner-info': this.status === 'info',
            'banner-caution': this.status === 'caution',
            'banner-success': this.status === 'success',
            'banner-light': this.tone === 'light',
            'banner-strong': this.tone === 'strong',
        };
    }
}
