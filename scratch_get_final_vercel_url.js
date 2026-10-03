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

  // Click "Continue to Project"
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('a, button'));
      const c = btns.find(b => b.innerText && b.innerText.includes('Continue to Project'));
      if (c) c.click();
    })()`
  });

  await new Promise(r => setTimeout(r, 4000));

  const projectInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
      const vercelLinks = links.filter(l => l.includes('.vercel.app'));
      return {
        url: window.location.href,
        title: document.title,
        vercelLinks: Array.from(new Set(vercelLinks)),
        text: document.body.innerText.substring(0, 500)
      };
    })()`,
    returnByValue: true
  });
  console.log('PROJECT INFO:', JSON.stringify(projectInfo.result.value, null, 2));

  ws.close();
})().catch(console.error);
