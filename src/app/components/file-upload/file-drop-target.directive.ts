import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[appFileDropTarget]',
    exportAs: 'filedroptarget',
    standalone: true,
})
export class FileDropTargetDirective {
    @Input()
    public disabled = false;

    @HostBinding('class.fileover')
    public fileOver = false;

    @Output()
    public fileDropped = new EventEmitter<FileList | null>();

    @HostListener('dragover', ['$event'])
    onDragOver(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.disabled) {
            return;
        }

        this.fileOver = true;
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.disabled) {
            return;
        }

        this.fileOver = false;
    }

    @HostListener('drop', ['$event'])
    public ondrop(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.disabled) {
            return;
        }

        this.fileOver = false;
        const files = evt.dataTransfer?.files;
        if (files?.length) {
            this.fileDropped.emit(files);
        }
    }
}
