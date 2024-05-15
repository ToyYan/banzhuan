
import axios from 'axios';
interface TickerData {
  status: string;
  date: string;
  data: Record<string, {
    opening_price: string,
    closing_price: string,
    min_price: string,
    max_price: string,
    units_traded: string,
    acc_trade_value: string,
    prev_closing_price: string,
    units_traded_24H: string,
    acc_trade_value_24H: string,
    fluctate_24H: string,
    fluctate_rate_24H: string,
  }>
}
export async function getTicker() {
  const res = await axios.get('https://api.bithumb.com/public/ticker/ALL_KRW');
  const data = res.data as TickerData;
  return data.data;
}