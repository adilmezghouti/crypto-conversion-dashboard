// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {MetaData} from "../types";

const asyncCallWithTimeout = async (asyncPromise: Promise<string>) => {
  let timeoutHandle: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Async call timeout limit reached')),
      parseInt(process.env.API_TIMEOUT || '3000')
    )
  })

  return Promise.race([asyncPromise, timeoutPromise]).then(result => {
    clearTimeout(timeoutHandle);
    return result;
  })
}

const handler1 = async (symbol: string) => {
  const API_KEY = process.env.COIN_MARKET_CAP_API_KEY
  const options = {method: 'GET', headers: {accept: 'application/json', 'X-CMC_PRO_API_KEY': API_KEY}};

  const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${symbol}`, options)
  const data: Record<string, Array<{ logo: string }>> = (await response.json()).data
  return Object.values(data)[0]?.[0]?.logo
}

//This is just to show how redundancy would work
const handler2 = handler1

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetaData>
) {
  let logo = await asyncCallWithTimeout(handler1(req.query.symbol as string))
  if (!logo) {
    logo = await asyncCallWithTimeout(handler2(req.query.symbol as string))
  }

  if (logo) {
    res.status(200).json({
      logo
    })
  } else {
    res.status(400).end()
  }
}
