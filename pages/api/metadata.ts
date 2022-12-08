// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {MetaData} from "../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetaData>
) {
  const API_KEY = process.env.COIN_MARKET_CAP_API_KEY
  const options = {method: 'GET', headers: {accept: 'application/json', 'X-CMC_PRO_API_KEY': API_KEY}};

  const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${req.query.symbol}`, options)
  const data = (await response.json()).data
  if (data) {
    res.status(200).json({
      logo: Object.values(data)[0]?.[0]?.logo
    })
  } else {
    res.status(400).end()
  }
}
