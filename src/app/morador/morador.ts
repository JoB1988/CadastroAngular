export interface IFilter {
    values: IRangeTypeValues | ICheckboxTypeValues;
    inputType: string;
    elementName: string;
    elementNameTranslate?: string;
}

interface IRangeTypeValues {
    min: number;
    max: number;
    actual: number;
}

interface ICheckboxTypeValues {
    value: string;
    checked: boolean;
}
