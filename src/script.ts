import VaultModel from "./data/models/vault.model"
import EntryModel from "./data/models/entry.model"
import './data/mongodb'
import Contract from 'web3-eth-contract'
import {VAULT_ABI} from './data/vault-abi'
import {ethers} from 'ethers'
import 'dotenv/config'
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
    //This function assumes that decimal doesn't matter
    const bnToFloat = (number: number) => {
      return parseFloat(ethers.utils.formatUnits(ethers.BigNumber.from(number), 12))
    }
    const calcAverage = (data : Array<any>, days: number) => {
      const firstAmount = bnToFloat(data[0].amount)
      const lastAmount = bnToFloat(data[data.length - 1].amount)
      const daysInYear = 365
      let average = (lastAmount - firstAmount)/firstAmount * daysInYear / days

      return average
    }

    const apyDateConfig : {
      type: APYS,
      ms: number,
      days: number
    }[] = [
      {
        type: 'apy',
        ms: YEAR_IN_MS,
        days: 365
      },
      {
        type: 'apy1d',
        ms: ONE_DAY_IN_MS,
        days: 1
      },
      {
        type: 'apy3d',
        ms: THREE_DAY_IN_MS,
        days: 3
      },
      {
        type: 'apy7d',
        ms: SEVEN_DAY_IN_MS,
        days: 7
      },
    ]
    type APYS = 'apy' | 'apy1d' | 'apy3d' | 'apy7d'
    const doAverage = (type: APYS, ms : number, days: number) => {
      EntryModel.find({
        time:{$gt: Date.now() - ms}
      }).sort('time').then(res => {
        //todo - make work with more than one vault
        const average = calcAverage(res, days)
        updateAverage(type, average.toString())
      })
    }
    const updateAverage = (type: APYS, average : string) => {
      VaultModel.findOneAndUpdate(
        {vaultId: ID}, //filter
        {[type]: average}, //update 
        {}, (err, doc, res) => {
          if (err) {
            console.log(err)
          }
          console.log(res)
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
      doAverage(i.type, i.ms, i.days)
    })

        // EntryModel.find({
        //   time:{$gt: Date.now() - SEVEN_DAY_IN_MS}
        // }).then(res => console.log(res))

        
    }, process.env.REFRESH_MS && parseInt(process.env.REFRESH_MS) || 5000)
}

export default main

