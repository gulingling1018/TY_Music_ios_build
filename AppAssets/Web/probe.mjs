import { createNativeClient, createPlaybackProjection } from './native-client.mjs'
import { inspectResources } from './resource-probe.mjs'

const client = createNativeClient(window)
const acceptPlayback = createPlaybackProjection()
const element = id => document.getElementById(id)
const show = (id, value) => { element(id).textContent = JSON.stringify(value, null, 2) }

function playback(value) { if (acceptPlayback(value)) show('playback-state', value) }
function downloads(value) {
  show('download-state', value)
  const actions = element('download-actions')
  actions.replaceChildren()
  for (const record of value.records ?? []) {
    if (record.state !== 'running') continue
    const button = document.createElement('button')
    button.textContent = `取消：${record.title}`
    button.onclick = () => run(button, () => client.request('download.cancel', { id: record.id }))
    actions.append(button)
  }
}

async function run(button, work) {
  button.disabled = true
  element('message').dataset.error = 'false'
  element('message').textContent = '正在处理…'
  try { await work(); element('message').textContent = '操作完成，请核对状态和实际行为。' }
  catch (error) { element('message').textContent = `${error.code ?? 'ERROR'}：${error.message}`; element('message').dataset.error = 'true' }
  finally { button.disabled = false }
}
function bind(id, work) { element(id).onclick = () => run(element(id), work) }
async function refresh() {
  playback(await client.request('playback.snapshot'))
  downloads(await client.request('download.snapshot'))
}
bind('resources', async () => show('resource-state', await inspectResources(document, window)))
bind('sqlite', async () => show('resource-state', await client.request('probe.sqlite')))
bind('import', async () => playback(await client.request('probe.importAudio', {}, { timeoutMs: 180000 })))
bind('remote', async () => playback(await client.request('probe.addRemoteAudio', { url: element('audio-url').value.trim() })))
bind('refresh', refresh)
bind('clear', async () => playback(await client.request('playback.clear')))
bind('seek-button', async () => playback(await client.request('playback.seek', { positionMs: Number(element('seek').value) * 1000 })))
element('mode').onchange = () => run(element('mode'), async () => playback(await client.request('playback.mode', { mode: element('mode').value })))
for (const button of document.querySelectorAll('[data-command]')) {
  button.onclick = () => run(button, async () => playback(await client.request(`playback.${button.dataset.command}`)))
}
bind('bili-download', async () => {
  await client.request('download.fromBili', { input: element('bili-input').value.trim(), page: Number(element('bili-page').value) }, { timeoutMs: 90000 })
  await refresh()
})
bind('direct-download', async () => {
  await client.request('download.enqueue', { url: element('audio-url').value.trim() })
  await refresh()
})
bind('load-downloads', async () => playback(await client.request('download.loadCompleted')))
window.addEventListener('tymusic:native', event => {
  if (event.detail?.name === 'playback') playback(event.detail.data)
  if (event.detail?.name === 'downloads') downloads(event.detail.data)
})
document.addEventListener('visibilitychange', () => { if (!document.hidden) run(element('refresh'), refresh) })
run(element('refresh'), async () => { show('native-info', await client.request('probe.info')); await refresh() })
