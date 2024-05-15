import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.binance.com/api/v3/'
});

type TradStatus = 'PRE_TRADING'|'TRADING'|'POST_TRADING'|'END_OF_DAY'|'HALT'|'AUCTION_MATCH'|'BREAK';

interface ExchangeInfo {
  timezone: string;
  serverTime: string;
  // rateLimits: any;
  // exchangeFilters: any;
  symbols: {
    symbol: string;
    status: TradStatus;
    baseAsset: string;
    baseAssetPrecision: string;
    quoteAsset: string;
    quotePrecision: string;
    quoteAssetPrecision: string;
    orderType: string[];
    permissions: ('SPOT' | 'MARGIN' | 'LEVERAGED')[];
    permissionSets: string[];
  }[]
}

export async function exchangeInfo(): Promise<ExchangeInfo> {
  const res = await api.get('exchangeInfo');
  const data = res.data as ExchangeInfo;
  return data;
}

export async function getMarkets() {
  const exInfo = await exchangeInfo();
  // console.log( exInfo.symbols
  //   .filter((symbol) =>symbol.quoteAsset === 'USDT' && symbol.status === 'TRADING')
  //   // .map(symbol => symbol.baseAsset)
  // )

  const markets = exInfo.symbols
    .filter((symbol) => symbol.quoteAsset === 'USDT' && symbol.status === 'TRADING')
    .map(symbol => symbol.baseAsset);
  return markets;
}

export async function getTickerPrice() {
  const res = await api.get('ticker/price');
  let data = res.data as {symbol: string; price: string}[];
  data = data.filter(({symbol}) => symbol.indexOf('USDT') > 0)
  .map(({symbol, price}) => ({symbol: symbol.replace('USDT', ''), price}))
  return data;
}