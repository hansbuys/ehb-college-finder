import axios from "axios";

export interface School {
    name: string;
}

export class SchoolRepository {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `http://${process.env.DATASERVICE_HOST}:${process.env.DATASERVICE_PORT}`;
    }

    public async getForState(state: string): Promise<School[]> {
        let result: any;

        try {
            result = await this.getSchoolsFromDataService(state);
        } catch (err) {
            throw new Error(`The data service returned an error: ${err}`);
        }

        return result.data.map((r: { name: string }) => {
            return { name: r.name };
        });
    }

    private getSchoolsFromDataService(state: string): Promise<any> {
        return axios.get(`${this.baseUrl}/find/by-state/${state}`);
    }
}
