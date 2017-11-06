// example call : https://api.data.gov/ed/collegescorecard/v1/schools.json?school.state=MI&_fields=id,school.name&api_key=<api-key>
import axios from 'axios'
import { readFile } from 'fs-extra';

export class CollegeScorecardService {
    public async getApiKey(): Promise<string> {
        let apiKeyFile = process.env.COLLEGESCORECARD_API_KEY_SECRET_FILE
        let apiKey = await readFile(apiKeyFile, 'utf8')
        return apiKey
    }

    public async findSchoolsByState(stateCode: string): Promise<Array<string>> {
        let apiKey = await this.getApiKey();
        let url = `https://api.data.gov/ed/collegescorecard/v1/schools.json?school.state=${stateCode}&_fields=id,school.name&api_key=${apiKey}`

        var schoolNames: Array<string> = await axios.get(url)
            .then((result) => {
                let schools: Array<any> = result.data.results

                return schools.map((school) => 
                    school["school.name"])
            })

        return schoolNames
    }
}