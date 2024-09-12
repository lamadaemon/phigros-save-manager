const fs = require('fs')

// Chart constants is from https://github.com/Catrong/phi-plugin/blob/main/resources/info/difficulty.csv
const csv = fs.readFileSync('difficulty.csv').toString().split('\n')
const table = []

for (const row of csv) {
    const [name, ez, hd, i, at] = row.split(/[ \t,]/).map(it => it.trim())
    if (!name) continue
    table.push({ name, diff: [ez, hd, i, at].filter(Boolean) })
}

console.log(`export const diffTable: { [key in string]: number[] } = {`)

for (const entry of table) {
    console.log(`    "${entry.name}": [${entry.diff.join()}], `)
}

console.log(`}`)