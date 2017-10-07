import { ConversationModel } from '../data/conversations';

const createConversation = (users, roomId) => {
    users = users.map(user => {
        user.unreadMessages = 0
        return user;
    });

    const conversationInstance = new ConversationModel({
        users,
        roomId,
        messages: []
    });

    return conversationInstance.save(err => {
        if (err)
            console.error(`Conversation instance failed to save: ${err}`);
    })
}

const getConversationsByUserId = (user, roomId) => {
    return ConversationModel.find({ roomId: roomId, users: { $elemMatch : {_id: user._id}}}).then(user => user);
}

const sendMessage = async (conversationId, user, message) => {
    const conversation = await ConversationModel.findById(conversationId);

    conversation.messages.push({
        content: message
    });

    conversation.users = conversation.users.map(u => {
        if(u._id !== user._id)
            u.unreadMessages += 1;
        return u;
    });

    return conversation.save(err => {
        if(err)
            console.error(`An issue arose while adding a message ${err}`);
    });
}

export { createConversation, sendMessage, getConversationsByUserId }