import { Query, FilterQuery, Document, Model } from "mongoose";
import IRead from "./interfaces/IRead";
import IWrite from "./interfaces/IWrite";

class DAO implements IRead, IWrite{
    private model: Model<Document>;

    constructor(model: Model<Document>){
        this.model = model;
    }

    findAll(): Query<any, any, {}, any> {
        return this.model.find({});
    }
    find(filter: FilterQuery<Document<any, any, any>>): Query<any, any, {}, any> {
        return this.model.find(filter);
    }
    findById(id: string): Query<any, any, {}, any> {
        return this.model.findById(id);
    }
    create(resource: any): Promise<any> {
        return this.model.create(resource);
    }
    updateById(id: string, resource: any,options?: any): Query<any,any> {
        return this.model.findByIdAndUpdate(id,resource,options);
    }
    deleteById(id: string): Query<any,any> {
        return this.model.findByIdAndDelete(id);
    }
}

export default DAO;