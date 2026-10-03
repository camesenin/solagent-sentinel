const WebSocket = require('ws');

(async () => {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/C9FBB78706C228452FCAF8631089106E');
  await new Promise(r => ws.on('open', r));
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const onMsg = (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.id === msgId) {
          ws.off('message', onMsg);
          resolve(msg.result);
        }
      };
      ws.on('message', onMsg);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  // Poll for up to 60 seconds
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 4000));
    const status = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('vercel.app'));
        const isReady = text.includes('Congratulations') || text.includes('Ready') || text.includes('Visit') || links.length > 0;
        const isBuilding = text.includes('Building') || text.includes('Deploying') || text.includes('Deployment started');
        const isError = text.includes('Error') || text.includes('Failed');
        return { isReady, isBuilding, isError, links, preview: text.substring(0, 300) };
      })()`,
      returnByValue: true
    });
    console.log(`Poll ${i + 1}:`, status.result.value.isReady ? 'READY!' : status.result.value.isBuilding ? 'BUILDING...' : status.result.value.isError ? 'ERROR' : 'UNKNOWN');
    if (status.result.value.isReady && status.result.value.links.length > 0) {
      console.log('LIVE VERCEL URLS:', status.result.value.links);
      break;
    }
  }

  ws.close();
})().catch(console.error);
