import generateKeyPair from "jose/webcrypto/util/generate_key_pair";
import orm from "./orm";

export default async function getKeys() {
    const db = await orm.get();
    if(db.keyPair === undefined) {
        const kpObj = await generateKeyPair("ES256");
        db.keyPair = {
            //@ts-expect-error
            publicKey: kpObj.publicKey.export({ type: "spki", format: "jwk" }),
            //@ts-expect-error
            privateKey: kpObj.privateKey.export({ type: "pkcs8", format: "jwk" })
        };
        await orm.set(db);
    }
    
    return db.keyPair;
}