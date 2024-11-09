import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { SpaceCasePipe } from './space-case.pipe';

// Pipe that can handle type 'unknown' and adds spaces before converting to title case.
@Pipe({
    name: 'titlespacecase',
    standalone: true,
})
export class TitleWithSpaceCasePipe implements PipeTransform {
    private readonly titlePipe = new TitleCasePipe();
    private readonly spacePipe = new SpaceCasePipe();

    transform(value: string): string;
    transform(value: null | undefined): null;
    transform(value: string | null | undefined): string | null;
    transform(value: string | null | undefined | unknown): string | null | unknown;
    transform(value: string | null | undefined | unknown): string | null | unknown {
        if (value == null) return null;
        if (typeof value !== 'string') {
            return value;
        }

        return this.titlePipe.transform(this.spacePipe.transform(value));
    }
}
