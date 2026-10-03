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

  const clickDeploy = await send('Runtime.evaluate', {
    expression: `(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      const deployBtn = allButtons.find(b => b.innerText && b.innerText.trim() === 'Deploy');
      if (deployBtn) {
        deployBtn.click();
        return { clicked: true, text: deployBtn.innerText };
      }
      return { clicked: false, buttons: allButtons.map(b => b.innerText) };
    })()`,
    returnByValue: true
  });
  console.log('Deploy Click Result:', clickDeploy.result.value);

  // Wait for build initiation
  await new Promise(r => setTimeout(r, 6000));

  const afterDeploy = await send('Runtime.evaluate', {
    expression: `({
      url: window.location.href,
      title: document.title,
      textPreview: document.body.innerText.substring(0, 600)
    })`,
    returnByValue: true
  });
  console.log('After Deploy State:', afterDeploy.result.value);

  ws.close();
})().catch(console.error);
