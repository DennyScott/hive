import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const gamestateSchema = new Schema({

});

const gameStateModel = mongoose.model('GameStateModel', gamestateSchema);
export { gameStateModel };