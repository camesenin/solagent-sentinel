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

  const findAndClick = await send('Runtime.evaluate', {
    expression: `(() => {
      // Find all elements containing solagent-sentinel
      const allDivs = Array.from(document.querySelectorAll('*'));
      const targetDiv = allDivs.find(el => el.innerText && el.innerText.includes('solagent-sentinel') && el.querySelector('button, a'));
      if (targetDiv) {
        const btn = targetDiv.querySelector('button, a');
        if (btn) {
          btn.click();
          return { clicked: true, text: btn.innerText, tag: btn.tagName };
        }
      }

      // Try finding button directly
      const btns = Array.from(document.querySelectorAll('button'));
      const importBtn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('import'));
      if (importBtn) {
        importBtn.click();
        return { clicked: true, text: importBtn.innerText, method: 'direct import button' };
      }

      return { clicked: false, allButtons: btns.map(b => b.innerText) };
    })()`,
    returnByValue: true
  });
  console.log('Click Import Result:', findAndClick.result.value);

  await new Promise(r => setTimeout(r, 4000));

  const afterState = await send('Runtime.evaluate', {
    expression: `({
      url: window.location.href,
      title: document.title,
      textPreview: document.body.innerText.substring(0, 400)
    })`,
    returnByValue: true
  });
  console.log('After state:', afterState.result.value);

  ws.close();
})().catch(console.error);
