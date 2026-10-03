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

  const clickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const gh = btns.find(b => b.innerText && b.innerText.includes('Continue with GitHub'));
      if (gh) { gh.click(); return { clicked: true, text: gh.innerText }; }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log('Click result:', clickRes.result.value);

  await new Promise(r => setTimeout(r, 4000));

  const afterState = await send('Runtime.evaluate', {
    expression: `({
      url: window.location.href,
      title: document.title,
      textPreview: document.body.innerText.substring(0, 300)
    })`,
    returnByValue: true
  });
  console.log('After state:', afterState.result.value);

  ws.close();
})().catch(console.error);
