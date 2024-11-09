import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FileDropTargetDirective } from './file-drop-target.directive';

@Component({
    standalone: true,
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrl: './file-upload.component.scss',
    imports: [CommonModule, MatButtonModule, MatIconModule, FileDropTargetDirective],
})
export class FileUploadComponent {
    @ViewChild('file')
    public file?: ElementRef;

    @Input()
    public disabled = false;

    @Input() 
    allowMultiple: boolean = true;

    //TODO Handle this on drag&drop too.
    @Input()
    public fileTypes?: string;

    @Input()
    public action = 'Upload';

    @Input()
    public dropMessage = 'Drag and drop file here';

    @Input()
    public or = 'or';

    @Output()
    public filesChange = new EventEmitter<FileList | null>();

    public upload(files: FileList | null) {
        this.filesChange.emit(files);

        /*
         * Reset the file input
         * So that re-selecting the same file will re-trigger the change event.
         */
        if (this.file && this.file.nativeElement) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            this.file.nativeElement.value = null;
        }
    }
}
