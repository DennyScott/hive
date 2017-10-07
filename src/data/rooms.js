import mongoose from 'mongoose';

const rooms = () => {
  const Schema = mongoose.Schema;

  const RoomSchema = new Schema({
    name: {type: String, required: true},
    totalSize: {type: Number, min: 0, max: 100, required: true},
    currentSize: {type:Number, min: 1, max: 100, required: true},
    players: [{firstname: String, lastname: String, email: String, username: String, _id: Schema.Types.ObjectId}],
    owner: {firstname: String, lastname: String, email: String, username: String, _id: Schema.Types.ObjectId},
    createdAt: { type: Date, default: Date.now },
    isOpen: {type: Boolean, default: true}
  });

  return mongoose.model('RoomModel', RoomSchema)
}

const RoomModel = rooms();

export {RoomModel}
