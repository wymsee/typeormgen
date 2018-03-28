import { Big } from 'big.js';
import { Moment } from 'moment';

type GenPartial<T> = {
    [P in keyof T]?: T[P] extends Moment ? Moment | string :
        T[P] extends Date ? Date | string :
        T[P] extends boolean ? boolean | 0 | 1 :
        T[P] extends Big ? Big | string :
        T[P];
}

declare const bigTransformer {
    from: (value: string | number) => Big;
    to: (value: Big) => string;
}

declare const booleanTransformer {
    from: (value: boolean | 0 | 1) => boolean;
    to: (value: boolean) => 0 | 1;
}

declare const momentTransformer {
    from: (value: Date | string) => Moment;
    to: (value: Moment) => string;
}
