import * as fs from 'fs-extra';
import * as debug from 'debug'

export class StateChecker {
    public async exists(state: string): Promise<boolean> {     

        var data = await fs.readFile('res/us-states.json', 'utf8');

        var usStates : Array<State> = JSON.parse(data)
        
        return usStates.some((s) => s.name === state || s.abbreviation === state)
    }
}

class State {
    public name: string
    public abbreviation: string
}