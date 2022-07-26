import mongodb from './data/mongodb'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as rateLimit from 'express-rate-limit'
import RouteVault from './routes/vault.routes'
import script from './script'

const app = express()
const port = 8080 // default port to listen

// Rate limitting
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120 // limit each IP to 60 requests per windowMs
})
app.use(limiter)

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// User cors headers
app.use(cors())

// Routes
RouteVault(app)

async function startServer () {
    await mongodb
    script()
    // start the express server
    app.listen(port, () => {
        // tslint:disable-next-line:no-console
        console.log(`server started at http://localhost:${ port }`)
    })
}

export default startServer()
