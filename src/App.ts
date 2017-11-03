import * as express from 'express'
import * as debug from 'debug'
import { StateChecker } from './StateChecker';

class App {
    public express

    constructor() {
        this.express = express()
        this.mountRoutes()
    }

    private mountRoutes(): void {
        const router = express.Router()
        router.get('/find/by-state/:state', async (req, res) => {
            try {
                let state: string = req.params.state;

                if (!await new StateChecker().exists(state)) {
                    debug(`${state} is not a US State.`);
                    
                    return res.status(500).json(`${state} is not a US State.`)
                }
                return res.json({
                    message: `Hello ${state}!`
                })
            } catch (err) {
                return res.status(500).json(err)
            }
        })
        this.express.use('/', router)
    }
}

export default new App().express