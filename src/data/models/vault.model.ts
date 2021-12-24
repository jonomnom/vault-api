import * as mongoose from 'mongoose'

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
}, {
    timestamps: true
})

export default mongoose.model('vault', VaultSchema)
