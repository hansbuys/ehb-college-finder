import { readFile } from "fs-extra";

export class StateChecker {
    private allStates: State[] = null;

    public async getAllStates(): Promise<State[]> {
        if (!this.allStates) {
            const data = await readFile("res/us-states.json", "utf8");
            this.allStates = JSON.parse(data);
        }
        return this.allStates;
    }

    public async exists(state: string): Promise<boolean> {
        const states = await this.getAllStates();

        return states.some((s) =>
            s.name === state ||
            s.abbreviation === state);
    }

    public async getStateCode(state: string): Promise<string> {
        const states = await this.getAllStates();

        const result = states.find((s) =>
            s.name === state ||
            s.abbreviation === state);

        return result.abbreviation;
    }
}

class State {
    public name: string;
    public abbreviation: string;
}
