import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

const cors = Cors();

export default function runMiddleware(req: NextApiRequest, res: NextApiResponse) {
    return new Promise((resolve, reject) => {
        cors(req, res, result => {
            if(result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        })
    });
}