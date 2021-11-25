const contentsToChunks = (str) => {
  const chunks = []
  const tmps = []
  const lines = str.split('\n')
  for (const line of lines) {
    tmps.push(line)
    const joinStr = tmps.join('\n')
    const len = !chunks.length ? 10 : 1000
    if (joinStr.length < len) continue
    chunks.push(joinStr)
    tmps.splice(0, tmps.length)
  }
  if (tmps.length) chunks.push(tmps.join('\n'))
  return chunks
}

let str = `# aaaaa
## bbbbbbbbbbbbbb
### ccccc
# aaaaa
## bbbbbbbbbbbbbb
### ccccc
# aaaaa
## bbbbbbbbbbbbbb
### ccccc
# aaaaa
## bbbbbbbbbbbbbb
### ccccc
# aaaaa
## bbbbbbbbbbbbbb
### ccccc
# aaaaa
## bbbbbbbbbbbbbb
### ccccc`

const r = contentsToChunks(str)
console.log(r)