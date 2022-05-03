import { Query } from "mongoose";

export default interface IWrite{
    create(resource: any): Promise<any>;
    updateById(id: string,resource: any): Query<any,any>;
    deleteById(id: string): Query<any,any>;
}