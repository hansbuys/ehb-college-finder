export class CollegeScorecardService {
    public async findSchoolNamesByState(stateCode: string): Promise<string[]> {
        return [
            `School in ${stateCode}`
        ];
    }
}
