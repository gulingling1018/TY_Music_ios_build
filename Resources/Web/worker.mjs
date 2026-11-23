self.onmessage = event => self.postMessage({ echo: event.data, moduleWorker: true })
