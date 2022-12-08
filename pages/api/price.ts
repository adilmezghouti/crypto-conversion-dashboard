// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {PriceData} from "../types";

 export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PriceData>
) {
  const API_KEY = process.env.COIN_MARKET_CAP_API_KEY
  const options = {method: 'GET', headers: {accept: 'application/json', 'X-CMC_PRO_API_KEY': API_KEY}};
  const {symbol, amount} = req.query
  const response = await fetch(`https://pro-api.coinmarketcap.com/v2/tools/price-conversion?symbol=${symbol}&amount=${amount}&convert=USD`, options)
   const data = (await response.json()).data
  if (data) {
    res.status(200).json({
      price: data?.[0]?.quote.USD.price
    })
  } else {
    res.status(400).end()
  }

}
