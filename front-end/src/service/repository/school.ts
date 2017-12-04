export interface School {
    name: string;
}

export class SchoolRepository {
    public async getForState(state: string): Promise<School[]> {
        return [
            { name: "Test 5" },
            { name: "Test 3" },
            { name: "Test 2" },
            { name: "Test 1" },
            { name: "Test 4" },
            { name: "Test 6" },
        ];
    }
}
