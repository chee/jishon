#!/usr/bin/env node
const parseArgs = require('minimist')
const jishon = require('./index.js')

const WORDS = 'words'
const SENTENCES = 'sentences'
const NAMES = 'names'
const TAGS = 'tags'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    w: WORDS,
    s: SENTENCES,
    n: NAMES,
    t: TAGS
  }
})

const tagFilter = tags => word =>
  tags.some(tag => word.tags.includes(tag.toLowerCase()))

const filterForTags = tags => response =>
  tags
    ? Object.assign({}, response, {
      words: response.words.filter(tagFilter(tags))
    })
    : response

const selectSections = options => response => {
  const sections = [WORDS, SENTENCES, NAMES]
  const requestedSections = sections
    .map(section => options[section] && section)
    .filter(Boolean)

  const sectionRequested = !!requestedSections.length

  if (!sectionRequested) {
    return response
  }

  if (requestedSections.length === 1) {
    return response[requestedSections]
  }

  return requestedSections.reduce((results, section) => {
    results[section] = response[section]
    return results
  }, {})
}

const term = argv._.join(' ')

const tags = Array.isArray(argv.tags)
  ? argv.tags
  : argv.tags && [argv.tags]

jishon(term)
  .then(filterForTags(tags))
  .then(selectSections(argv))
  .then(JSON.stringify)
  .then(console.log)
