import IRegionPreview from 'mondosurf-library/modelStrict/iRegionPreview';

export default interface ICountry {
    id: number;
    name: string;
    slug: string;
    flag: string;
    number_of_regions: number;
    number_of_spots: number;
    regions: IRegionPreview[];
    loading?: boolean;
}