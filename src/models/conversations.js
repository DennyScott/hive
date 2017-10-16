import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    roomId: { type:Schema.Types.ObjectId, required: true },
    users: [{firstname: String, lastname: String, username: String, email: String, _id: Schema.Types.ObjectId, unreadMessages: Number }],
    messages: [{
        content: String,
        createdAt: {type: Date, default: Date.now},
        createdBy: {firstname: String, lastname: String, username: String, _id: Schema.Types.ObjectId, email: String}
    }],
    createdAt: { type: Date, default: Date.now }
});
const ConversationModel = mongoose.model('ConversationModel', ConversationSchema);

export { ConversationModel }