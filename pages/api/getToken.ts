// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { SignJWT } from "jose/jwt/sign";
import { parseJwk } from "jose/jwk/parse";
import getKeys from "../../src/keys";
import child_process from "child_process";
import path from "path";
import runMiddleware from "../../src/corsMiddleware";

function parseAuthHeader(header: string) {
    let colonPos = 0;
    const decoded = atob(header);
    for(let i = 0; i < decoded.length; i++) {
        if(decoded[i] === ":") {
            colonPos = i;
            break;
        }
    }
    return [decoded.slice(0, colonPos), decoded.slice(colonPos + 1)];
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res);
    if(req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    const { appId } = req.query as { [key: string]: string };
    if(!req.headers.authorization) {
        res.status(401);
        res.end();
        return;
    }
    const [user, password] = parseAuthHeader(req.headers.authorization);

    if(!(await checkCredentials(user, password))) {
        res.status(401);
        res.end();
        return;
    }

    const jwt = await new SignJWT({ user, appId })
        .setProtectedHeader({ alg: "ES256" })
        .setIssuedAt()
        .setIssuer("zauth.zephyr")
        .setExpirationTime("2h")
        .sign(await parseJwk((await getKeys()).privateKey, "ES256"))

    res.status(200).send(jwt);
}

function checkCredentials(user: string, password: string): Promise<boolean> {
    return new Promise(resolve => {
        const authResult = child_process.spawn("sudo", ["/usr/bin/python3", path.join(process.cwd(), "src/checkPassword.py"), user, password], {});
        authResult.on("exit", (code) => {
            resolve(code === 0);
        });
    });
}