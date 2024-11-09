import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [MatButtonModule, MatDialogModule, CommonModule, MatDialogActions, MatDialogContent, MatDivider],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
    ) {}

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}
