import mongoose from 'mongoose';

export default interface IRead{
    findAll(): mongoose.Query<any,any>;
    find(filter: mongoose.FilterQuery<mongoose.Document>): mongoose.Query<any,any>;
    findById(id: string): mongoose.Query<any,any>;
}