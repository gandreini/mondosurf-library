export interface IMapFilterConfigs {
    parameters: IMapFilterParameter[];
}

export interface IMapFilterParameter {
    parameter: string;
    translation_key: string;
    config: IMapFilterConfig[];
}

export interface IMapFilterConfig {
    label: string;
    code: string;
}