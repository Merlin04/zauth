/* ORM
 * A simple ORM that manages a single JSON file. Updates are stored
 * in memory and periodically written to disk to improve performance.
 */
import fs from "fs";
import { JWK } from "jose/webcrypto/types";
import util from "util";

const writeFile = util.promisify(fs.writeFile);

export class ORM<T extends object> {
    filePath: string;
    cache: T;
    changesMade: boolean;
    doneReadingFile: Promise<void>

    constructor(filePath: string) {
        console.log("new ORM");
        this.filePath = filePath;
        this.cache = undefined as unknown as T;
        this.changesMade = false;
        this.doneReadingFile = new Promise(resolve => {
            fs.readFile(this.filePath, (err, data) => {
                this.cache = JSON.parse(data.toString());
                setInterval(this.update.bind(this), 1000);
                resolve();
            });
        });
    }

    async get(): Promise<T> {
        await this.doneReadingFile;
        return this.cache;
    }

    async set(newVal: T) {
        this.cache = newVal;
        this.changesMade = true;
    }

    private async update() {
        if(this.changesMade) {
            this.changesMade = false;
            await writeFile(this.filePath, JSON.stringify(this.cache));
        }
    }
}

export type DBType = {
    keyPair: {
        publicKey: JWK,
        privateKey: JWK    
    } | undefined
};

if(!globalThis.globalOrm) {
    globalThis.globalOrm = new ORM<DBType>(process.env.NEXT_PRIVATE_DB_PATH as string);
}

export default globalThis.globalOrm as ORM<DBType>;