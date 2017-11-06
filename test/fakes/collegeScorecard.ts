export class CollegeScorecardService {
    public async findSchoolsByState(stateCode: string): Promise<Array<string>> {
        return [
            `School in ${stateCode}`
        ]
    }
}