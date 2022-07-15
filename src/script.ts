import VaultModel from "./data/models/vault.model"
import './data/mongodb'
import Contract from 'web3-eth-contract'
import {VAULT_ABI} from './data/vault-abi'
//@ts-ignore
const Web3 = require('web3')
const web3 = new Web3('https://rpc.ankr.com/fantom/')
const vaultAddress = '0x58e0ac1973f9d182058e6b63e7f4979bc333f493'
const ceazorVault = new web3.eth.Contract(VAULT_ABI, vaultAddress);
const ID = 'Ceazor'
let count = 0

const MINUTE = 1000*60
const HOUR = MINUTE * 60

async function main () {
    const record = await VaultModel.findOne({ vaultId: ID })
    if (record === null) {
        await VaultModel.create({
            vaultId: ID,
            addr: vaultAddress,
            apy: 0,
            apy3d: 0,
            apy7d: 0,
            tvl: count,
            tvlUsd: 0,
            token: 'Ceazor-fBeets-Vault',
            symbol: 'ceazfBEETS',
            data: [{"time": new Date(), "amount": "1"}]
        })
    }
    
    

    // Grab and update the record every 10 seconds just for kicks
    setInterval(async () => {
    const totalSupply = await ceazorVault.methods.getPricePerFullShare().call();
        console.log(totalSupply)
        VaultModel.findOneAndUpdate(
          {vaultId: ID},
          { $push: {
            data: {
              time: Date.now(),
              amount: totalSupply.toString()
              }
            }
          }, {}, (err) => {
            console.log(err)
          }
        )
    }, 5000)
}

export default main

