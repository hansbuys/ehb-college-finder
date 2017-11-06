import { Router, Request, Response, NextFunction } from 'express';
import { StateChecker } from '../service/stateChecker';

class StateFinder {
    router: Router;

    constructor() {
        this.router = Router()
        this.init()
    }

    public async findByState (req: Request, res: Response, next: NextFunction) : Promise<Response> {
        try {
            let state: string = req.params.state
            let stateExists = await new StateChecker().exists(state)

            if (!stateExists) 
                return res
                    .status(500)
                    .json(`${state} is not a US State.`)
            
            return res
                .json({ message: `Hello ${state}!` })
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

export default new StateFinder().router