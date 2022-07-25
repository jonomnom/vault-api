import * as mongoose from 'mongoose'

const EntrySchema = new mongoose.Schema({
    vaultId: mongoose.Types.ObjectId,
    time: Date,
    amount: String
})

export default mongoose.model('entry', EntrySchema);
