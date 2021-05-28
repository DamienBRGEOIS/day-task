import Mongoose from 'mongoose';

const inviteSchema = new Mongoose.Schema({
  boardId: { type: Mongoose.Schema.Types.ObjectId, required: true },
  creationDate: { type: Date, default: Date.now },
});

const Invite = Mongoose.model('Invite', inviteSchema);

export default Invite;
