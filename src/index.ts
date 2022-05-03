import express from "express";
import router from "./routes";
import mongoose from "mongoose";

import dotenv from "dotenv";
import path from "path";

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import expressJSDocSwagger from "express-jsdoc-swagger";
import swaggerOptions from "./swagger";

dotenv.config({ path: path.resolve(__dirname,"../.env") });

const app = express();

app.use(cors());

process.env.NODE_ENV === "development" && app.use(morgan("dev"));

process.env.NODE_ENV === "production" && app.use(helmet());

mongoose.Promise = global.Promise;

const mongodbURIs: Map<string,string> = new Map<string,string>([
    ["development", <string>process.env.DEV_DB_URI],
    ["production", <string>process.env.PROD_DB_URI],
    ["test", <string>process.env.TEST_DB_URI]
]);

const mongodbURI = <string>mongodbURIs.get(<string>process.env.NODE_ENV);

mongoose.connect(mongodbURI, {
    autoIndex: true
}).catch((err) => {
    console.error(err);
});

app.use(express.json());

app.use(express.urlencoded( { extended: true } ));

app.use("/",router);

expressJSDocSwagger(app)(swaggerOptions);

const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST || "0.0.0.0";

const server = app.listen(port,host,() => {
    console.log(`App running on: http://${host}:${port}`)
});

export default app;

export { server };
