import * as vaults from '../controllers/vault.controller'

const RouteVault = (app: any) => {
    // Retrieve all Notes
    app.get('/vault/start', vaults.start)
    app.get('/vault', vaults.findAll)

    // Retrieve a single Note with noteId
    app.get('/vault/:vaultId', vaults.findOne)

}

export default RouteVault
