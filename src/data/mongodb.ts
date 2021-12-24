
import * as mongoose from 'mongoose'
import * as process from 'process'
import { EventEmitter } from 'stream'

export class MongooseDB extends EventEmitter {
    public static inst?: MongooseDB
    public connected: boolean
    public db: any

    constructor () {
        super()
        this.connected = false
    }

    private async connect () {
        return new Promise<void>((resolve, reject) => {
            mongoose.connect(`mongodb://localhost/robo`, {
                // useNewUrlParser: true
                // useUnifiedTopology: true,
                // useFindAndModify: false,
                // useCreateIndex: true,
                // user: process.env.MONGO_USER,
                // pass: process.env.MONGO_PASS
            }).then((db) => {
                this.emit('connected')
                console.log('Connected')
                this.db = db
                resolve()
            }).catch((err) => {
                console.log('Failed to connect to mongo db')
                reject(err)
            })
        })
    }

    static disconnect () {
        // TODO
    }

    static async instance (): Promise<MongooseDB> {
        if (this.inst === undefined) {
            this.inst = new MongooseDB()
            await this.inst.connect()
        }
        return this.inst
    }
}

export default MongooseDB.instance()
