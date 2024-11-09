import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { UploadImageDialogComponent } from './upload-image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    standalone: true,
    template:
        '<button mat-raised-button color="primary" type="button" (click)="onUploadClicked()"> Upload Image </button>',
    styles: `:host{ 
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }`,
    imports: [MatButton],
})
export class UploadImageComponent {
    public constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog) {}

    public onUploadClicked(): void {
        this.dialog
            .open(UploadImageDialogComponent, {
                minHeight: '40%',
                minWidth: '20%',
            })
            .afterClosed()
            .subscribe(() => {
                this.snackBar.open('Image uploaded successfully', 'Dismiss', {
                    duration: 3000,
                });
            });
    }
}
