import { getTicker as getBithumbTicker } from './bithumb'; 
import { getMarkets as getBinancemarkets, getTickerPrice } from './binance';

// 获取可以搬砖的币种；
export async function getMarkets() {
  const binanceMarkts = await getBinancemarkets();
  const bithumbMarkets = [];

  const data = await getBithumbTicker();
  for (const key  in data) {
    bithumbMarkets.push(key);
  }
  const allowed = bithumbMarkets.filter((market) => binanceMarkts.includes(market));
  const denCoins = ['BTG', 'ALT', 'BTT'];
  allowed.push('USDT');
  return allowed.filter((market) => !denCoins.includes(market));
}

export async function getPrices(coins: string[]) {
  const bnTickers = await getTickerPrice();
  const krTickers = await getBithumbTicker();
  const prices = coins.map((coin) => {
    const bnInfo = bnTickers.find(symbol => symbol.symbol === coin);
    const krInfo = krTickers[`${coin}`];
    const bnPrice = coin === 'USDT' ? 1 : parseFloat(bnInfo?.price as string);
    const krPrice = parseFloat(krInfo?.closing_price);
    let krPriceUsd = 0;
    let rate = 0;
    if (krPrice && bnPrice) {
      krPriceUsd = krPrice / 188 / 7.32;
      rate = (krPriceUsd - bnPrice) / bnPrice;
    }
  
    return {
      coin: coin,
      bnPrice,
      krPrice,
      krPriceUsd,
      rate,
    }
  }).sort((a,b) => b.rate - a.rate);
  return prices;
}