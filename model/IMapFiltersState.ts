export interface IMapFiltersState {
    direction?: IMapFiltersDirection;
    bottom?: IMapFiltersBottom;
    experience?: IMapFiltersExperience;
    surfboard?: IMapFiltersSurfboard;
    months?: IMapFiltersMonth;
}

export interface IMapFiltersDirection {
    A?: boolean;
    R?: boolean;
    L?: boolean;
}

export interface IMapFiltersBottom {
    1?: boolean;
    2?: boolean;
    3?: boolean;
    4?: boolean;
    5?: boolean;
    6?: boolean;
    7?: boolean;
    8?: boolean;
}

export interface IMapFiltersExperience {
    1?: boolean;
    2?: boolean;
    3?: boolean;
}

export interface IMapFiltersSurfboard {
    1?: boolean;
    2?: boolean;
    3?: boolean;
    4?: boolean;
    5?: boolean;
}

export interface IMapFiltersMonth {
    1?: boolean;
    2?: boolean;
    3?: boolean;
    4?: boolean;
    5?: boolean;
    6?: boolean;
    7?: boolean;
    8?: boolean;
    9?: boolean;
    10?: boolean;
    11?: boolean;
    12?: boolean;
}