import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Observable, map, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        HomeComponent,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        CommonModule,
        RouterModule,
        MatMenuModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    @ViewChild(MatSidenav)
    private sidenav!: MatSidenav;

    public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map((result) => result.matches),
        shareReplay()
    );

    protected isIframe = false;

    constructor(private readonly breakpointObserver: BreakpointObserver) {}

    public ngOnInit(): void {
        this.isIframe = window !== window.parent && !window.opener;
    }

    protected toggleSidenav(): void {
        void this.sidenav.toggle();
    }
}
