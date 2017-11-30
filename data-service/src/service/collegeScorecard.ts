import axios from "axios";
import logger from "../logging";

export class CollegeScorecardService {
    private baseUrl = "https://api.data.gov/ed/collegescorecard/v1/schools.json";

    public async findSchoolNamesByState(stateCode: string): Promise<string[]> {
        const apiKey = this.getApiKey();
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

                    logger.debug(`Succesfully fetched ${results.length} results from page ${currentPage} / ${numberOfPages}`);

                    schoolNames = schoolNames.concat(currentSchoolNames);
                });

            page++;
        }

        logger.info(`Succesfully fetched ${schoolNames.length} results for ${stateCode}`);

        return schoolNames;
    }

    private getApiKey() {
        const apiKey = process.env.COLLEGESCORECARD_API_KEY || "<collegescorecard-api-key>";
        if (!apiKey || apiKey === "<collegescorecard-api-key>") {
            logger.error("Environment variable COLLEGESCORECARD_API_KEY has not been set.");
            throw new Error(
                "Environment variable 'COLLEGESCORECARD_API_KEY' has not been set. " +
                "Please verify the creation of a .env file or its content.");
        }

        return process.env.COLLEGESCORECARD_API_KEY;
    }
}
