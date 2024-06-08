#!/usr/bin/env node
// eslint-disable-next-line node/shebang
import { Converter } from '.'

function main () {
  const [,, format, ...mappings] = process.argv

  type CharacterMap = {
    [key: string]: string
  }

  if (mappings.length < 1) {
    return error('no mapping provided')
  }

  const input = mappings.pop()

  if (!input) {
    return error('no input')
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
