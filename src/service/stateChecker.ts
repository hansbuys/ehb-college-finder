import { readFile } from 'fs-extra';

export class StateChecker {
    private allStates: Array<State> = null

    public async getAllStates(): Promise<Array<State>> {
        if (!this.allStates) {
            var data = await readFile('res/us-states.json', 'utf8');
            this.allStates = JSON.parse(data)
        }
        return this.allStates
    }

    public async exists(state: string): Promise<boolean> {
        let states = await this.getAllStates()

        return states.some((s) =>
            s.name === state ||
            s.abbreviation === state)
    }

    public async getStateCode(state: string): Promise<string> {
        let states = await this.getAllStates()

        let result = states.find((s) =>
            s.name === state ||
            s.abbreviation === state)

        return result.abbreviation;
    }
}

class State {
    public name: string
    public abbreviation: string
}