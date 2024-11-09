import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'spacecase',
    standalone: true,
})
export class SpaceCasePipe implements PipeTransform {
    transform(value: string): string;
    transform(value: null | undefined): null;
    transform(value: string | null | undefined): string | null;
    transform(value: string | null | undefined): string | null {
        if (value == null) return null;
        if (typeof value !== 'string') {
            // Copied from angular codebase so this should not be an issue
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw Error(`InvalidPipeArgument: '${value}' for pipe 'SpaceCasePipe'`);
        }

        return value.replace(/([A-Z])/g, ' $1').trim();
    }
}
