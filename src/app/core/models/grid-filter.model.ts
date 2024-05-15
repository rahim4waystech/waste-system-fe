import { CondOperator } from '@nestjsx/crud-request';

export class GridFilter {
    field: string;
    condition: string; // https://github.com/nestjsx/crud/wiki/Requests#frontend-usage
    value: any;
}