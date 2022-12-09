import {CurrencyInfo} from "../types";

export const fetchCurrencies = async (): Promise<CurrencyInfo[]> => {
  const options = {method: 'GET', headers: {accept: 'application/json'}}

  const response = await fetch('/api/currencies', options)
  return await response.json() as CurrencyInfo[]
}

export const fetchMetadata = async (symbol: string): Promise<string> => {
  const options = {method: 'GET', headers: {accept: 'application/json'}}

  const response = await fetch(`/api/metadata?symbol=${symbol}`, options)
  return (await response.json()).logo
}

export const fetchPrice = async (amount:number, symbol: string): Promise<number> => {
  const options = {method: 'GET', headers: {accept: 'application/json'}}

  const response = await fetch(`/api/price?amount=${amount}&symbol=${symbol}`)
  return (await response.json()).price
}