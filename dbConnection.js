import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);

export class Database {
    dbUrl = "mongodb://localhost:27017/db";
    connection = mongoose.connection;

    constructor(){
        try{
            this.connection
                .on('connected', console.info.bind(console, 'Connected to database'))
                .on('error', console.error.bind(console, 'Error with database connection'));
        } catch (error) {
            console.error(error);
        }
    }

    async connect(){
        try{
            await mongoose.connect(this.dbUrl,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    family: 4
                });
        } catch (error) {
            console.error(error);
        }
    }

    async close(){
        try{
            await this.connection.close();
        } catch (error) {
            console.error(error);
        }
    }
}