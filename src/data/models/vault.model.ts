import * as mongoose from 'mongoose'

const LoggedEntry = new mongoose.Schema({
    time: Date,
    amount: String
})

const VaultSchema = new mongoose.Schema({
    vaultId: String,
    addr: String,
    apy: Number,
    apy1d: Number,
    apy2d: Number,
    apy3d: Number,
    apy7d: Number,
    tvl: Number,
    tvlUsd: Number,
    token: String,
    symbol: String,
    data: [LoggedEntry]
}, {
    timestamps: true
})

export default mongoose.model('vault', VaultSchema)
