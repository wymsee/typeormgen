import { Big } from 'big.js';
import { Moment } from 'moment';

/**
 * this makes all properties of T optional.
 * also makes any properties with typeof Moment be Moment | string
 * any properties with typeof Date be Date | string
 * any properties with typeof boolean be boolean | 0 | 1
 * any properties with typeof Big be Big | string
 * all other properties keep their initial type
 * See mapped and conditional types
 */
type GenPartial<T> = {
    [P in keyof T]?: T[P] extends Moment ? Moment | string :
        T[P] extends Date ? Date | string :
        T[P] extends boolean ? boolean | 0 | 1 :
        T[P] extends Big ? Big | string :
        T[P];
}

interface BigTransformer {
    from: (value: Big | string | number) => Big;
    to: (value: Big) => string;
}

interface BooleanTransformer {
    from: (value: boolean | 0 | 1) => boolean;
    to: (value: boolean) => 0 | 1;
}

interface MomentTransformer {
    from: (value: Moment | Date | string) => Moment;
    to: (value: Moment) => string;
}

interface TimeTransformer {
    from: (value: Moment | Date | string) => Moment;
    to: (value: Moment) => string;
}

declare const bigTransformer: BigTransformer;

declare const booleanTransformer: BooleanTransformer;

declare const momentTransformer: MomentTransformer;

declare const timeTransformer: TimeTransformer;
