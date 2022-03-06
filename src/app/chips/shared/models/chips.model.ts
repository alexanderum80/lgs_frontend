export interface IChips {
    IdChip: number;
    Color: string;
    Value: number;
    Image: Buffer;
}

export interface ChipsQueryResponse {
    getChips: IChips[];
    getChip: IChips;
}

export interface ChipsMutationResponse {
    createChip: IChips;
    updateChip: IChips;
    deleteChip: IChips;
}
