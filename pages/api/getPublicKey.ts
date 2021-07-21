// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "../../src/corsMiddleware";
import getKeys from "../../src/keys";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res);
    if(req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    res.status(200).json((await getKeys()).publicKey);
}