import { getMarkets, getPrices } from "./getMarkets";
import { join } from 'path';

let coins: string[] = [];
coins = await getMarkets();

let prices =  await getPrices(coins);

let clients: any[] = [];

// 每小时更新一次币对
setInterval(async () => {
  try {
    coins = await getMarkets();
  }catch(e: any) {
    console.log(e.message);
  }
}, 1000 * 60 * 10)

setInterval(async () => {
  if(clients.length > 0) {
    try {
      prices = await getPrices(coins);
      console.log('send to client:', clients.length);
      const memoryUsage = process.memoryUsage.rss()/1024/1024;
      console.log('process usage', memoryUsage, 'MB');
      clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(prices));
        }
      })
    } catch(e: any) {
      console.log(e.message);
    }
  }
}, 1000)

const server = Bun.serve({
  async fetch(req) {
    if (server.upgrade(req)) {
      return; 
    }
    let path = new URL(req.url).pathname as string;
    if (path === '/') {
      path = '/index.html'
    }
    const file = Bun.file(join(__dirname,'public', path));
    return new Response(file);
  },
  websocket: {
    message(ws, message) {},
    open(ws) {
      clients.push(ws);
      ws.send(JSON.stringify(prices));
    },
    close(ws, code, message) {
      clients = clients.filter(w => w !== ws);
    }
  },
  port: 3001,
});

console.log(`hostname: ${server.hostname}, port: ${server.port}`);
