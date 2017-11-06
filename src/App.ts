import * as express from 'express'
import stateFinder from './route/stateFinder'

class App {
    public express: express.Application

    constructor() {
        this.express = express()
        this.mountRoutes()
    }

    private mountRoutes(): void {
        const router = express.Router()
        
        this.express.use('/', router)
        this.express.use('/find/by-state', stateFinder)
    }
}

export default new App().express