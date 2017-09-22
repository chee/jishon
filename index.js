const scrape = require('scrape-it')

const ROOT = 'http://jisho.org/search'

function removeFurigana (dom) {
  return dom.not('.furigana').text().trim()
}

function parseAudio (dom) {
  return [].reduce.call(dom, (result, source) => {
    const type = source
      .attribs
      .type
      .replace('audio/', '')
    result[type] = source.attribs.src
    return result
  }, {})
}

function parseAbstractUrl (dom) {
  return dom.find('a').attr('href')
}

function parseAbstract (dom) {
  const readMore = dom.find('a')
  readMore.remove()
  return dom.text()
}

function parseListToLowerCase (dom) {
  return [].map.call(dom,
    item => dom.constructor(item).text().toLowerCase()
  )
}

function getConfig (options) {
  return {
    words: {
      listItem: '#primary .concept_light',
      data: {
        furigana: '.concept_light-representation .furigana',
        japanese: '.text',
        tags: {
          selector: '.concept_light-tag',
          how: parseListToLowerCase
        },
        meanings: {
          listItem: '.meaning-wrapper',
          data: {
            english: '.meaning-meaning',
            sentences: {
              listItem: '.sentence',
              data: {
                japanese: '.japanese',
                english: '.english'
              }
            }
          }
        },
        audio: {
          selector: 'audio source',
          how: parseAudio
        }
      }
    },
    sentences: {
      listItem: '#secondary .sentence',
      tags: {
        listItem: '.concept_light-tag'
      },
      data: {
        japanese: {
          selector: '.japanese_sentence',
          how: removeFurigana
        },
        english: '.english_sentence'
      }
    },
    names: {
      listItem: '#secondary .names .concept_light',
      tags: {
        listItem: '.concept_light-tag'
      },
      data: {
        japanese: '.japanese',
        meanings: {
          listItem: '.meaning-wrapper',
          data: {
            english: '.meaning-meaning',
            url: {
              selector: '.meaning-abstract',
              how: parseAbstractUrl
            },
            abstract: {
              selector: '.meaning-abstract',
              how: parseAbstract
            }
          }
        }
      }
    }
  }
}

module.exports = function get (term, options, callback) {
  const encodedTerm = encodeURIComponent(term)

  if (typeof options === 'function' && callback == null) {
    callback = options
    options = null
  }

  return new Promise((resolve, reject) => {
    const finish = (error, result) => {
      if (callback) {
        callback(error, result)
      }

      return error
        ? reject(error)
        : resolve(result)
    }

    scrape(
      `${ROOT}/${encodedTerm}`,
      getConfig(options),
      finish
    )
  })
}
