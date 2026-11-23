export class NativeBridgeError extends Error {
  constructor(message, code, status = 0) {
    super(message)
    this.name = 'NativeBridgeError'
    this.code = code
    this.status = status
  }
}

// 独立原型传输；正式Vue平台门面须在B阶段真机验证后接入。
export function createNativeClient(host = globalThis.window) {
  const pending = new Map()
  const session = host?.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  let sequence = 0
  let destroyed = false

  function settle(id, error, value) {
    const entry = pending.get(id)
    if (!entry) return
    pending.delete(id)
    clearTimeout(entry.timer)
    if (error) entry.reject(error)
    else entry.resolve(value)
  }

  function destroy() {
    if (destroyed) return
    destroyed = true
    host?.removeEventListener?.('pagehide', destroy)
    for (const id of pending.keys()) {
      settle(id, new NativeBridgeError('页面已关闭；尚未完成的原生操作请在恢复后核对状态', 'DISPOSED'))
    }
  }
  host?.addEventListener?.('pagehide', destroy)

  async function request(operation, body = {}, { timeoutMs = 30000 } = {}) {
    if (destroyed) throw new NativeBridgeError('桥接已关闭', 'DISPOSED')
    if (host?.location?.protocol !== 'tymusic:' || host.location.hostname !== 'app' || host.location.port || host.location.username || host.location.password) {
      throw new NativeBridgeError('原生桥只能由App内可信页面调用', 'UNTRUSTED_ORIGIN')
    }
    const handler = host?.webkit?.messageHandlers?.tyMusic
    if (typeof handler?.postMessage !== 'function') throw new NativeBridgeError('此环境没有iOS原生桥', 'UNAVAILABLE')
    if (typeof operation !== 'string' || !operation.length || operation.length > 64 || !body || Array.isArray(body) || typeof body !== 'object') {
      throw new NativeBridgeError('无效的操作或请求体', 'INVALID_ARGUMENT')
    }
    if (!Number.isFinite(timeoutMs) || timeoutMs < 1 || timeoutMs > 180000 || pending.size >= 16) {
      throw new NativeBridgeError('超时配置无效或并发请求过多', 'INVALID_ARGUMENT')
    }
    const id = `${session}:${++sequence}`
    const envelope = { protocolVersion: 1, id, operation, body }
    if (new TextEncoder().encode(JSON.stringify(envelope)).length > 64 * 1024) {
      throw new NativeBridgeError('桥接请求超过64KiB；请通过原生文件能力传输大文件', 'TOO_LARGE')
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => settle(id, new NativeBridgeError('原生操作等待超时，结果尚不确定；请刷新状态后再操作', 'TIMEOUT')), timeoutMs)
      pending.set(id, { resolve, reject, timer })
      try {
        const result = handler.postMessage(envelope)
        if (!result || typeof result.then !== 'function') throw new NativeBridgeError('原生桥未返回Promise', 'PROTOCOL_ERROR')
        result.then(reply => {
          if (!reply || reply.protocolVersion !== 1 || reply.id !== id || !Number.isInteger(reply.status) || reply.status < 100 || reply.status > 599) {
            settle(id, new NativeBridgeError('原生响应格式或请求ID不匹配', 'PROTOCOL_ERROR'))
          } else if (reply.status < 200 || reply.status >= 300) {
            settle(id, new NativeBridgeError(reply.error?.message || '原生操作失败', reply.error?.code || 'NATIVE_ERROR', reply.status))
          } else { settle(id, null, reply.data) }
        }, () => settle(id, new NativeBridgeError('原生桥拒绝了请求', 'TRANSPORT_ERROR')))
      } catch (error) {
        settle(id, error instanceof NativeBridgeError ? error : new NativeBridgeError('无法发送原生请求', 'TRANSPORT_ERROR'))
      }
    })
  }
  return { request, destroy }
}

export function createPlaybackProjection() {
  let session = null
  let sequence = -1
  const oldSessions = new Set()
  return function accept(value) {
    if (!value || typeof value.sessionId !== 'string' || !Number.isSafeInteger(value.seqNo) || value.seqNo < 0) return false
    if (oldSessions.has(value.sessionId)) return false
    if (session !== value.sessionId) {
      if (session !== null) oldSessions.add(session)
      session = value.sessionId
      sequence = -1
    }
    if (value.seqNo <= sequence) return false
    sequence = value.seqNo
    return true
  }
}
