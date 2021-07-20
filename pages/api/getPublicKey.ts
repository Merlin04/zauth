// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import getKeys from "../../src/keys";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json((await getKeys()).publicKey);
}