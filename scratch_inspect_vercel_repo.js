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

  const inspect = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText;
      const inputs = Array.from(document.querySelectorAll('input')).map(i => ({ placeholder: i.placeholder, value: i.value }));
      const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText).filter(Boolean);
      return {
        hasSolagent: text.includes('solagent-sentinel'),
        inputs,
        buttons: buttons.slice(0, 20)
      };
    })()`,
    returnByValue: true
  });
  console.log('Inspect Vercel new project UI:', inspect.result.value);

  ws.close();
})().catch(console.error);
