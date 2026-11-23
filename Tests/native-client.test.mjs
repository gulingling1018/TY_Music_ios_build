import test from 'node:test'
import assert from 'node:assert/strict'
import { createNativeClient, createPlaybackProjection } from '../AppAssets/Web/native-client.mjs'

function environment(postMessage) {
  const events = new EventTarget()
  return { location: new URL('tymusic://app/index.html'), webkit: { messageHandlers: { tyMusic: { postMessage } } },
    addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events) }
}
const response = (message, data, status = 200) => ({ protocolVersion: 1, id: message.id, status, data })

test('并发响应倒序返回仍关联正确请求', async () => {
  const requests = []
  const host = environment(message => new Promise(resolve => requests.push({ message, resolve })))
  const client = createNativeClient(host)
  try {
    const a = client.request('playback.play')
    const b = client.request('playback.next')
    requests[1].resolve(response(requests[1].message, '下一首'))
    requests[0].resolve(response(requests[0].message, '播放'))
    assert.deepEqual(await Promise.all([a, b]), ['播放', '下一首'])
  } finally { client.destroy() }
})

test('业务失败保留错误码和HTTP状态', async () => {
  const client = createNativeClient(environment(async message => ({ ...response(message, null, 501), error: { code: 'NOT_IMPLEMENTED', message: '尚未实现' } })))
  await assert.rejects(client.request('api.request'), { code: 'NOT_IMPLEMENTED', status: 501, message: '尚未实现' })
  client.destroy()
})

test('超时后的迟到响应不污染后续请求', async () => {
  let first
  const client = createNativeClient(environment(message => {
    if (!first) return new Promise(resolve => { first = { message, resolve } })
    return Promise.resolve(response(message, '新状态'))
  }))
  await assert.rejects(client.request('playback.next', {}, { timeoutMs: 10 }), { code: 'TIMEOUT' })
  first.resolve(response(first.message, '过时状态'))
  assert.equal(await client.request('playback.snapshot'), '新状态')
  client.destroy()
})

test('关闭页面拒绝所有未完成请求并禁止再次发送', async () => {
  let posted = 0
  const host = environment(() => { posted++; return new Promise(() => {}) })
  const client = createNativeClient(host)
  const a = client.request('probe.importAudio')
  const rejection = assert.rejects(a, { code: 'DISPOSED' })
  host.dispatchEvent(new Event('pagehide'))
  await rejection
  await assert.rejects(client.request('playback.play'), { code: 'DISPOSED' })
  assert.equal(posted, 1)
})

test('错误ID、版本、状态和非Promise响应被拒绝', async () => {
  for (const reply of [m => ({ ...response(m, 1), id: 'wrong' }), m => ({ ...response(m, 1), protocolVersion: 2 }),
    m => ({ ...response(m, 1), status: true }), () => null]) {
    const client = createNativeClient(environment(message => Promise.resolve(reply(message))))
    await assert.rejects(client.request('probe.info'), { code: 'PROTOCOL_ERROR' })
    client.destroy()
  }
  const client = createNativeClient(environment(() => undefined))
  await assert.rejects(client.request('probe.info'), { code: 'PROTOCOL_ERROR' })
  client.destroy()
})

test('非可信页面和缺少原生容器时不发送请求', async () => {
  for (const origin of ['https://app/', 'tymusic://evil/', 'tymusic://app.evil/', 'tymusic://u@app/', 'tymusic://app:80/']) {
    let posted = false
    const host = environment(() => { posted = true })
    host.location = new URL(origin)
    const client = createNativeClient(host)
    await assert.rejects(client.request('probe.info'), { code: 'UNTRUSTED_ORIGIN' })
    assert.equal(posted, false)
    client.destroy()
  }
  const host = environment(() => {})
  delete host.webkit
  const client = createNativeClient(host)
  await assert.rejects(client.request('probe.info'), { code: 'UNAVAILABLE' })
  client.destroy()
})

test('按UTF8字节限制中文请求，大文件不进入消息桥', async () => {
  let posted = false
  const client = createNativeClient(environment(async message => { posted = true; return response(message, true) }))
  await assert.rejects(client.request('probe.info', { text: '中'.repeat(30000) }), { code: 'TOO_LARGE' })
  assert.equal(posted, false)
  assert.equal(await client.request('probe.info', { text: '中文% 空格' }), true)
  client.destroy()
})

test('并发上限拒绝第17个请求且释放后可继续使用', async () => {
  const requests = []
  const client = createNativeClient(environment(message => new Promise(resolve => requests.push({ message, resolve }))))
  const pending = Array.from({ length: 16 }, () => client.request('playback.snapshot'))
  await assert.rejects(client.request('playback.snapshot'), { code: 'INVALID_ARGUMENT' })
  for (const request of requests) request.resolve(response(request.message, 'ok'))
  assert.equal((await Promise.all(pending)).length, 16)
  const next = client.request('probe.info')
  requests.at(-1).resolve(response(requests.at(-1).message, 'after'))
  assert.equal(await next, 'after')
  client.destroy()
})

test('传输同步异常和异步拒绝都转为明确错误', async () => {
  for (const send of [() => { throw new Error('private URL') }, () => Promise.reject(new Error('private URL'))]) {
    const client = createNativeClient(environment(send))
    await assert.rejects(client.request('probe.info'), error => error.code === 'TRANSPORT_ERROR' && !error.message.includes('private URL'))
    client.destroy()
  }
})

test('播放投影过滤迟到、重复及已退役会话事件', () => {
  const accept = createPlaybackProjection()
  assert.equal(accept({ sessionId: 'a', seqNo: 8 }), true)
  assert.equal(accept({ sessionId: 'a', seqNo: 7 }), false)
  assert.equal(accept({ sessionId: 'a', seqNo: 8 }), false)
  assert.equal(accept({ sessionId: 'b', seqNo: 0 }), true)
  assert.equal(accept({ sessionId: 'a', seqNo: 9 }), false)
  assert.equal(accept({ sessionId: 'b', seqNo: 1 }), true)
  assert.equal(accept({ sessionId: 'b', seqNo: NaN }), false)
})
