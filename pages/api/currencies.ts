// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {CurrencyData} from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CurrencyData>
) {
  const API_KEY = process.env.COIN_MARKET_CAP_API_KEY
  const options = {method: 'GET', headers: new Headers({accept: 'application/json', 'X-CMC_PRO_API_KEY': API_KEY as string})}

  const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', options)
  const data = (await response.json()).data
  if (data) {
    const currencies = data.map(({id, symbol, quote} : {id: string, symbol: string, quote: Record<string, Record<string,string>>}) => ({
      id: Number(id),
      symbol,
      fiat: quote.USD.price
    }))
    res.status(200).json(currencies)
  } else {
    res.status(400).end()
  }
}