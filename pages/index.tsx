import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {ChangeEventHandler, useCallback, useEffect, useState} from "react"
import {fetchCurrencies, fetchMetadata, fetchPrice} from './utils'
import {CurrencyInfo} from "./types";
import ErrorBoundary from "../components/error-boundary";
import Image from "next/image";


const Countdown = ({value, callback}: { value: number, callback: () => void }) => {
  const [counter, setCounter] = useState(value)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter => {
        if (counter === 0) {
          callback()
          return value
        } else {
          return counter - 1
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  })

  return <div className={styles.countdown}>Rate will update in {counter}</div>
}

export default function Home() {
  const DEFAULT_SYMBOL = 'BTC'
  const DEFAULT_LOGO = 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png'
  const [from, setFrom] = useState(DEFAULT_SYMBOL)
  const [fiat, setFiat] = useState(0)
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([])
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO)
  const [loading, setLoading] = useState(false)

  const refreshInfo = useCallback(async () => {
    setLoading(true)
    const logo = await fetchMetadata(from)
    const price = await fetchPrice(1, from)
    setLogoUrl(logo)
    setFiat(price)
    setLoading(false)
  }, [from])

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setFrom(event.target.value)
  }

  const handleConvertClick = async () => {
    await refreshInfo()
  }

  useEffect(() => {
    fetchCurrencies().then(setCurrencies)
  }, [])

  useEffect(() => {
    refreshInfo()
  }, [refreshInfo])

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Conversion Dashboard</title>
        <meta name="description" content="Crypto Conversion Dashboard"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <ErrorBoundary>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Conversion Dashboard
          </h1>
          <div className={styles.grid}>
          <span className={styles.logo}>
            <Image src={logoUrl} alt="Crypto Currency Logo" width={30} height={30}/>
          </span>
            <select className={styles.select} value={from} onChange={handleChange}>
              {currencies?.map(({id, symbol}) => (<option key={id} value={symbol}>{symbol}</option>))}
            </select>
            <div className={styles.fiat}>{`$${Number(fiat).toFixed(2)}`}</div>
          </div>
          {loading ? <div className={styles.loading}>Loading the new rate...</div> :
            <Countdown value={10} callback={refreshInfo}/>}
          <button className={styles.button} onClick={handleConvertClick}>{loading ? 'CONVERTING...' : 'CONVERT'}</button>
        </main>
      </ErrorBoundary>
    </div>
  )
}
