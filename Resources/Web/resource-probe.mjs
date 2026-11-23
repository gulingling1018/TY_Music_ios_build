async function deadline(promise, milliseconds = 5000) {
  let timer
  try {
    return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('检测超时')), milliseconds) })])
  } finally { clearTimeout(timer) }
}

export async function inspectResources(document, host) {
  const result = {}
  async function check(name, work) {
    try { result[name] = { status: 'passed', detail: await deadline(work()) } }
    catch (error) { result[name] = { status: 'failed', detail: error.message } }
  }
  await check('dynamicImport', async () => (await import('./dynamic-probe.mjs')).marker)
  await check('fetch', async () => {
    const response = await host.fetch(new URL('./probe.svg', host.location.href))
    if (!response.ok || !(await response.text()).includes('<svg')) throw new Error('资源响应不正确')
    return '读取成功'
  })
  await check('image', async () => {
    const image = document.getElementById('image-probe')
    await image.decode()
    if (!image.naturalWidth) throw new Error('图片没有有效尺寸')
    return `${image.naturalWidth} × ${image.naturalHeight}`
  })
  await check('localStorage', async () => {
    const key = 'tymusic-probe-persistence-v1'
    let previous
    try { previous = JSON.parse(host.localStorage.getItem(key)) } catch { throw new Error('旧存储记录无法解析') }
    const current = { visits: (previous?.visits ?? 0) + 1, savedAt: Date.now(), text: '中文持久化' }
    host.localStorage.setItem(key, JSON.stringify(current))
    if (JSON.parse(host.localStorage.getItem(key)).text !== current.text) throw new Error('存储回读失败')
    return { previous, current, note: '刷新/重开后核对previous；单次通过不证明跨升级持久性' }
  })
  await check('indexedDB', async () => {
    const open = host.indexedDB.open('tymusic-probe-v1', 1)
    open.onupgradeneeded = () => open.result.createObjectStore('assets')
    const db = await deadline(new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
      open.onblocked = () => reject(new Error('数据库打开被阻塞'))
    }))
    try {
      const transaction = db.transaction('assets', 'readwrite')
      const store = transaction.objectStore('assets')
      const read = store.get('blob')
      const previous = await new Promise((resolve, reject) => { read.onsuccess = () => resolve(read.result); read.onerror = () => reject(read.error) })
      // 新事务中写入并等commit；不在已自动提交的事务上继续put。
      await new Promise((resolve, reject) => {
        const write = db.transaction('assets', 'readwrite')
        write.objectStore('assets').put(new Blob(['中文素材'], { type: 'text/plain' }), 'blob')
        write.oncomplete = resolve
        write.onerror = () => reject(write.error)
        write.onabort = () => reject(write.error ?? new Error('事务中断'))
      })
      return { previousBlob: previous ? await previous.text() : null, note: '重开后核对previousBlob' }
    } finally { db.close() }
  })
  await check('moduleWorker', async () => {
    const worker = new host.Worker(new URL('./worker.mjs', host.location.href), { type: 'module' })
    try {
      return await deadline(new Promise((resolve, reject) => {
        worker.onmessage = event => event.data.echo === '中文Worker' ? resolve(event.data) : reject(new Error('Worker响应错误'))
        worker.onerror = () => reject(new Error('Worker加载失败'))
        worker.postMessage('中文Worker')
      }))
    } finally { worker.terminate() }
  })
  await check('blobImage', async () => {
    const source = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><rect width="2" height="2" fill="red"/></svg>'], { type: 'image/svg+xml' })
    const url = host.URL.createObjectURL(source)
    try { const image = new host.Image(); image.src = url; await image.decode(); return image.naturalWidth }
    finally { host.URL.revokeObjectURL(url) }
  })
  return result
}
