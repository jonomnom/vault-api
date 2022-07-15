import VaultModel from "./data/models/vault.model"
import './data/mongodb'

const ID = 'I am a test vault!!'
let count = 0
async function main () {

    // Create mock record
    const record = await VaultModel.findOne({ vaultId: ID })
    if (record === null) {
        await VaultModel.create({
            vaultId: ID,
            addr: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
            apy: 0,
            apy3d: 0,
            apy7d: 0,
            tvl: count,
            tvlUsd: 0,
            token: 'USDC',
            symbol: 'rvUSDC',
        })
    }

    // Grab and update the record every 10 seconds just for kicks
    setInterval(async () => {
      console.log('ff')
        let record = await VaultModel.findOne({ vaultId: ID })
        if (record) {
            Object.assign(record, {
                tvl: count++
            })
            record.save()
        }
    }, 1000)
}

export default main()

