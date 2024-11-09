import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    imports: [RouterModule, MatIconModule],
})
export class NotFoundComponent {}
