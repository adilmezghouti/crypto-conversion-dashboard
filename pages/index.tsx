import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {ChangeEventHandler, useEffect, useState} from "react"
import {fetchCurrencies, fetchMetadata, fetchPrice} from './utils'
import {CurrencyInfo} from "./types";


const Countdown = ({value, callback} : {value: number, callback: () => void}) => {
  const [counter, setCounter] = useState(value)

  useEffect(() => {
    const interval = setInterval((args) => {
      setCounter(counter => {
        if (counter === 0){
          callback()
          return value
        } else {
          return counter - 1
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <div className={styles.countdown}>Rate will update in {counter}</div>
}

export default function Home() {
  const DEFAULT_SYMBOL = 'BTC'
  const [from, setFrom] = useState(DEFAULT_SYMBOL)
  const [fiat, setFiat] = useState(0)
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([])
  const [logoUrl, setLogoUrl] = useState('https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png')

  const refreshInfo = () => {
    fetchMetadata(from).then(setLogoUrl)
    fetchPrice(1, from).then(setFiat)
  }

  const handleChange = (event: ChangeEventHandler<HTMLSelectElement>) => {
    setFrom(event.target.value)
  }

  const handleConvertClick = () => {
    fetchCurrencies().then(setCurrencies)
  }

  useEffect(() => {
    fetchCurrencies().then(setCurrencies)
  }, [])

  useEffect(() => {
    refreshInfo()
  }, [from])

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Conversion Dashboard</title>
        <meta name="description" content="Crypto Conversion Dashboard"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Conversion Dashboard
        </h1>
        <div className={styles.grid}>
          <span className={styles.logo}>
            <img src={logoUrl} alt="Crypto Currency Logo" width={30} height={30}/>
          </span>
          <select className={styles.select} value={from} onChange={handleChange}>
            {currencies?.map(({id, symbol}) => (<option key={id} value={symbol}>{symbol}</option>))}
          </select>
          <div className={styles.fiat}>{`$${Number(fiat).toFixed(2)}`}</div>
        </div>
        <Countdown value={10} callback={refreshInfo} />
        <button className={styles.button} onClick={handleConvertClick}>CONVERT</button>
      </main>
    </div>
  )
}
