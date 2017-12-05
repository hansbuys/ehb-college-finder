import { HandlerBase } from "./handlerBase";
import { DictionaryOfStrings } from "../customTypes";
import { SchoolRepository } from "../repository/school";

export class FindByStateHandler extends HandlerBase {
    private schoolRepo: SchoolRepository;
    private maxNumberOfSchoolsToReturn: number;

    public readonly intent = "find-by-state";
    public parameterNames: string[] = ["state"];

    constructor(maxNumberOfSchoolsToReturn: number = 5) {
        super();
        this.schoolRepo = new SchoolRepository();
        this.maxNumberOfSchoolsToReturn = maxNumberOfSchoolsToReturn;
    }

    public async createReply(params?: DictionaryOfStrings): Promise<string | false> {
        if (!params || !params["state"]) {
            return false;
        }

        const state = params["state"].value;

        if (!state) {
            throw new Error("No state defined.");
        }

        const schoolsInState = await this.schoolRepo.getForState(state);
        const numberOfSchoolsInState = schoolsInState.length;

        if (numberOfSchoolsInState === 0) {
            return `No schools found in state ${state}.`;
        }

        let returnText = `Found ${numberOfSchoolsInState} schools for state ${state}.`;

        if (numberOfSchoolsInState > this.maxNumberOfSchoolsToReturn) {
            returnText += `\nReturning the first ${this.maxNumberOfSchoolsToReturn} alphabetically sorted:`;
        } else {
            returnText += "\nHere's the list:";
        }

        schoolsInState
            .sort((first, second) => first.name.localeCompare(second.name))
            .slice(0, 5)
            .forEach((school) => returnText += `\n - ${school.name}`);

        if (numberOfSchoolsInState > this.maxNumberOfSchoolsToReturn) {
            returnText += `\n - ...`;
        }

        return returnText;
    }
}
