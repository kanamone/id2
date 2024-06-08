#!/usr/bin/env node
// eslint-disable-next-line node/shebang
import { Converter } from '.'
import { readFileSync } from 'node:fs'

function main () {
  const [,, format, ...mappings] = process.argv

  type CharacterMap = {
    [key: string]: string
  }

  if (!format) {
    return error('no format provided')
  }

  if (mappings.length < 1) {
    return error('no mapping provided')
  }

  let input = mappings.length > 1 ? mappings.pop() : undefined

  if (!input) {
    input = readFileSync(0, 'utf-8').trim()
  }

  if (!/^\d+$/.test(input)) {
    return error('input is not a number')
  }

  const characterMap: CharacterMap = {}

  for (const [index, mapping] of mappings.entries()) {
    const parts = mapping.split(':')
    if (parts.length !== 2) {
      error(`invalid mapping format at mapping #${index} (${mapping})`)
    }

    const [character, sequence] = parts

    characterMap[character] = sequence
  }

  const converter = new Converter({
    format: Converter.format(format, characterMap)
  })

  const result = converter.stringify(BigInt(input))

  process.stdout.write(`${result}\n`)
}

main()

function error (message: string) {
  console.error(message)
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}
