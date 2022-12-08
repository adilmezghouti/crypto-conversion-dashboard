export type CurrencyData = {
  currencies: CurrencyInfo[]
}

export type CurrencyInfo = {
  id: number
  symbol: string
  fiat: number
}

export type MetaData = {
  logo: string
}

export type PriceData = {
  price: number
}
