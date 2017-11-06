// example call : https://api.data.gov/ed/collegescorecard/v1/schools.json?school.state=MI&_fields=id,school.name&api_key=<api-key>
import axios from 'axios'
import { readFile } from 'fs-extra'

export class CollegeScorecardService {
    private baseUrl = "https://api.data.gov/ed/collegescorecard/v1/schools.json"

    public getApiKey(): Promise<string> {
        let apiKeyFile = process.env.COLLEGESCORECARD_API_KEY_SECRET_FILE
        return readFile(apiKeyFile, 'utf8')
    }

    public async findSchoolNamesByState(stateCode: string): Promise<Array<string>> {
        let apiKey = await this.getApiKey()
        let page = 0

        let moreResultsAvailable = true

        var schoolNames: Array<string> = []

        while (moreResultsAvailable) {
            let url = this.baseUrl +
                `?school.state=${stateCode}` +
                "&_fields=school.name" +
                `&api_key=${apiKey}` +
                "&_per_page=100" +
                `&_page=${page}`

            await axios.get(url)
                .then((result) => {
                    let results: Array<any> = result.data.results
                    let metadata = result.data.metadata

                    let numberOfResults = metadata.total
                    let currentPage = metadata.page
                    let resultsPerPage = metadata.per_page

                    let numberOfPages = Math.floor(numberOfResults / resultsPerPage)
                    
                    // zero based current page
                    moreResultsAvailable = numberOfPages > currentPage 

                    let currentSchoolNames = results.map((school) =>
                        school["school.name"])

                    schoolNames = schoolNames.concat(currentSchoolNames)
                })

            page++
        }

        return schoolNames
    }
}