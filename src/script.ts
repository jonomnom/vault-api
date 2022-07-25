import VaultModel from "./data/models/vault.model"
import EntryModel from "./data/models/entry.model"
import './data/mongodb'
import Contract from 'web3-eth-contract'
import {VAULT_ABI} from './data/vault-abi'
import {ethers} from 'ethers'
//@ts-ignore
const Web3 = require('web3')
const web3 = new Web3('https://rpc.ankr.com/fantom/')
const vaultAddress = '0x58e0ac1973f9d182058e6b63e7f4979bc333f493'
const ceazorVault = new web3.eth.Contract(VAULT_ABI, vaultAddress);
const ID = 'Ceazor'
let count = 0

const MINUTE = 1000*60
const HOUR = MINUTE * 60
const ONE_DAY_IN_MS = HOUR * 24
const THREE_DAY_IN_MS = ONE_DAY_IN_MS * 3
const SEVEN_DAY_IN_MS = ONE_DAY_IN_MS * 7
const YEAR_IN_MS = ONE_DAY_IN_MS * 365
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
            data: []
        })
    }
    
    const calcAverage = (data : Array<any>) => {
      const average = data.reduce((p, c) => ethers.BigNumber.from(c.amount).add(p), ethers.BigNumber.from('0')).div(ethers.BigNumber.from(data.length.toString()))
      return average
    }

    const apyDateConfig : {
      type: APYS,
      ms: number
    }[] = [
      {
        type: 'apy',
        ms: YEAR_IN_MS
      },
      {
        type: 'apy1d',
        ms: SEVEN_DAY_IN_MS
      },
      {
        type: 'apy3d',
        ms: THREE_DAY_IN_MS
      },
      {
        type: 'apy7d',
        ms: ONE_DAY_IN_MS
      },
    ]
    type APYS = 'apy' | 'apy1d' | 'apy3d' | 'apy7d'
    const doAverage = (type: APYS, ms : number) => {
      EntryModel.find({
        time:{$gt: Date.now() - ms}
      }).then(res => {
        //todo - make work with more than one vault
        const average = calcAverage(res)
        console.log(average.toString())
        updateAverage(type, average.toString())
      })
    }
    const updateAverage = (type: APYS, average : string) => {
      VaultModel.findOneAndUpdate(
        {vaultId: ID}, //filter
        {[type]: average}, //update 
        {}, (err) => {
          console.log(err)
        }
      )
    }
    // Grab and update the record every 10 seconds just for kicks
    setInterval(async () => {
    const totalSupply = await ceazorVault.methods.getPricePerFullShare().call();
    console.log(totalSupply)
    const res = await EntryModel.create({
      vaultID: ID,
      time: Date.now(),
      amount: totalSupply.toString()
    })
    apyDateConfig.forEach(i => {
      doAverage(i.type, i.ms)
    })

        // EntryModel.find({
        //   time:{$gt: Date.now() - SEVEN_DAY_IN_MS}
        // }).then(res => console.log(res))

        
    }, 5000)
}

export default main

