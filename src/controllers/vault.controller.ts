import Vault from '../data/models/vault.model'

const ONE_DAY = 1000*60*60*24

// Retrieve and return all notes from the database.
export const findAll = (req: any, res: any) => {
    console.log('/vault received')
    Vault.find()
        .then((vaults: any) => {
            res.send(vaults.filter((e: any) => {
                const update = new Date(e.updatedAt)
                return Date.now() - update.getTime() < ONE_DAY
            }))
        }).catch((err: any) => {
            console.log(err)
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving notes.'
            })
        })
}

// Find a single note with a noteId
export const findOne = (req: any, res: any) => {
    Vault.findById(req.params.noteId)
        .then((note: any) => {
            if (!note) {
                return res.status(404).send({
                    message: 'Vault not found with id ' + req.params.noteId
                })
            }
            res.send(note)
        }).catch((err: any) => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: 'Vault not found with id ' + req.params.noteId
                })
            }
            return res.status(500).send({
                message: 'Error retrieving vault with id ' + req.params.noteId
            })
        })
}
