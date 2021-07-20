// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { jwtVerify } from "jose/jwt/verify";
import parseJwk, { KeyLike } from "jose/webcrypto/jwk/parse";

let PUBLIC_KEY: KeyLike | undefined = undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Parse ZAuth's public key if it hasn't been parsed already
    if(!PUBLIC_KEY) {
        PUBLIC_KEY = await parseJwk({
            "crv": "P-256",
            "kty": "EC",
            "x": "L3-19BuRNlPYCMGGmVR4yo6pXKdHWyg3pie4gZDOlLs",
            "y": "OWGfvyD2_KhMdTb-5Ie6HdlxqAJLXQl_zWkv9MYDxso"
        }, "ES256");
    }

    // Make sure the JWT was included in the request
    if(!req.query["jwt"] || Array.isArray(req.query["jwt"])) {
        res.status(401).end();
        return;
    }

    // Verify and get the data from the JWT
    const { payload } = await jwtVerify(req.query["jwt"], PUBLIC_KEY, {
        issuer: "zauth.zephyr"
    });
    
    if(payload.appId !== "zauth-example") {
        // This token isn't for this app, so don't accept it
        // This makes sure that someone can't take one person's token for one site and use it on every site that they use ZAuth with
        res.status(401).end();
        return;
    }

    // Do something, now that we know that the person sending the request is who they claim to be
    res.status(200).send(`Hello, ${payload.user}!`);
}