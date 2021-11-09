const contentsToChunks = (str) => {
  return str.match(/.{1,10}/g)
}

let str = ''

for (let i = 0; i < 33; i++) {
  str += 'a'
}

const r = contentsToChunks(str)
console.log(r)