import { Router, Request, Response, NextFunction } from 'express';
import { StateChecker } from '../service/stateChecker';
import { CollegeScorecardService } from '../service/collegeScorecard';

class StateFinder {
    router: Router;

    constructor() {
        this.router = Router()
        this.init()
    }

    public async findByState (req: Request, res: Response, next: NextFunction) : Promise<Response> {
        try {  
            let stateChecker = new StateChecker();
            let collegeScorecardService = new CollegeScorecardService();

            let state: string = req.params.state
            let stateExists = await stateChecker.exists(state)

            if (!stateExists) 
                return res
                    .status(500)
                    .json(`${state} is not a US State.`)

            let stateCode = await stateChecker.getStateCode(state)
            let schoolNames = await collegeScorecardService.findSchoolsByState(stateCode)

            let result = schoolNames
                .map((val) => new FindByStateResult(val));

            return res
                .json(result)

        } catch (err) {
            return res
                .status(500)
                .json(err)
        }
    }

    public init() : void {
        this.router.get('/:state', this.findByState)
    }
}

class FindByStateResult {
    public name: string

    constructor(name: string) {
        this.name = name
    }
}

export default new StateFinder().router