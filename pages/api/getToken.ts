// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { SignJWT } from "jose/jwt/sign";
import { parseJwk } from "jose/jwk/parse";
import getKeys from "../../src/keys";
import child_process from "child_process";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { appId, user, password } = req.query as { [key: string]: string };

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