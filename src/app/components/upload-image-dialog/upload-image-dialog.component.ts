import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FileDropTargetDirective } from '../file-upload/file-drop-target.directive';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
    standalone: true,
    templateUrl: './upload-image-dialog.component.html',
    styleUrl: './upload-image-dialog.component.scss',
    imports: [
        MatDividerModule,
        MatDialogTitle,
        MatDialogActions,
        MatDialogContent,
        FileUploadComponent,
        FileDropTargetDirective,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinner,
    ],
})
export class UploadImageDialogComponent {
    protected uploading = false;

    protected uploadedImage: string | ArrayBuffer | null = null;
    protected fileSelected = false;
    protected selectedFile: File | null = null;
    protected saving = false;

    public constructor(private readonly dialogRef: MatDialogRef<UploadImageDialogComponent>) {}

    protected upload = (files: FileList | null) => {
        if (!files || files.length !== 1) {
            return;
        }

        // TODO: Figure out what file types we allow.
        // if (files[0].type !== 'png') {
        //     // We have no way of actually guaranteeing that the file is the correct format,
        //     // so double check it here before we even bother trying to send it to the server.
        //     throw new Error('Only ".png" files can be uploaded.');
        // }

        this.uploading = true;

        const reader = new FileReader();
        reader.onload = () => {
            this.uploadedImage = reader.result;
        };
        reader.readAsDataURL(files[0]);
        this.selectedFile = files[0];

        this.fileSelected = true;
        this.uploading = false;
    };

    protected onUploadClicked(): void {
        // TODO: This is where you would send the uploaded image to the server.
        this.dialogRef.close();
    }

    protected onCancelClicked(): void {
        this.dialogRef.close();
    }

    protected onCancelImageClicked(): void {
        this.uploadedImage = null;
        this.fileSelected = false;
        this.selectedFile = null;
    }
}

interface FloorplanUploadDialogData {
    projectID: number;
}
