import { NextFunction, Request, Response, Router } from "express";
import { CollegeScorecardService } from "../service/collegeScorecard";
import { StateChecker } from "../service/stateChecker";

const debug = require("debug")("collegefinder");

class StateFinder {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public async findByState(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const state: string = req.params.state;

        try {
            const stateChecker = new StateChecker();
            const collegeScorecardService = new CollegeScorecardService();

            const stateExists = await stateChecker.exists(state);

            if (!stateExists) {
                const invalidStateMessage = `${state} is not a recognized US State identifier.`;
                debug(invalidStateMessage);
                return res
                    .status(500)
                    .json(invalidStateMessage);
            }

            const stateCode = await stateChecker.getStateCode(state);
            debug(`Fetching college names from CollegeScorecard API for ${state}`);
            const schoolNames = await collegeScorecardService.findSchoolNamesByState(stateCode);

            const result = schoolNames
                .map((val) => new FindByStateResult(val));

            return res
                .json(result);

        } catch (err) {
            debug(`An error occured while fetching college names for ${state} : ${err}`);
            return res
                .status(500)
                .json(err);
        }
    }

    public init(): void {
        debug("Mapping routes for StateFinder");

        this.router.get("/:state", this.findByState);
    }
}

class FindByStateResult {
    public name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export default new StateFinder().router;
