import axios from "axios";
import { readFile } from "fs-extra";

const debug = require("debug")("collegefinder");

export class CollegeScorecardService {
    private baseUrl = "https://api.data.gov/ed/collegescorecard/v1/schools.json";

    public getApiKey(): Promise<string> {
        const apiKeyFile = process.env.COLLEGESCORECARD_API_KEY_SECRET_FILE;
        return readFile(apiKeyFile, "utf8");
    }

    public async findSchoolNamesByState(stateCode: string): Promise<string[]> {
        const apiKey = await this.getApiKey();
        let page = 0;

        let moreResultsAvailable = true;

        let schoolNames: string[] = [];

        while (moreResultsAvailable) {
            const url = this.baseUrl +
                `?school.state=${stateCode}` +
                "&_fields=school.name" +
                `&api_key=${apiKey}` +
                "&_per_page=100" +
                `&_page=${page}`;

            await axios.get(url)
                .then((result) => {
                    const results: any[] = result.data.results;
                    const metadata = result.data.metadata;

                    const numberOfResults = metadata.total;
                    const currentPage = metadata.page;
                    const resultsPerPage = metadata.per_page;

                    const numberOfPages = Math.floor(numberOfResults / resultsPerPage);

                    // zero based current page
                    moreResultsAvailable = numberOfPages > currentPage;

                    const currentSchoolNames = results.map((school) =>
                        school["school.name"]);

                    debug(`Succesfully fetched ${results.length} results from page ${currentPage} / ${numberOfPages}`);

                    schoolNames = schoolNames.concat(currentSchoolNames);
                });

            page++;
        }

        debug(`Succesfully fetched ${schoolNames.length} results for ${stateCode}`);

        return schoolNames;
    }
}
