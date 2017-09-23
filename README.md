# jishon

search jisho.org from node and the command line.

## examples

there is a promise interface

```js
const jishon = require('jishon')

(async () => {
  const magic = await jishon('magic')

  console.log(magic.sentences[0])
  //  {
  //   japanese: 'くろまほう黒魔法のはなし話をき聞きたいです。がくいん学院ではさわりしかき聞いたことがないんですがきょうみ興味があります。',
  //   english: 'I\'d like to hear about black magic. I was only told the highlights in the academy, and it interests me.\n        — Tatoeba'
  // }
})

// or jishon('tea').then(console.log)
```

there is also a callback interface

```js
jishon('犬', (error, response) => {
  const {words} = response
  const common = words.find(word => word.tags.includes('common word'))
  console.log(common.meanings[0].english) // => dog (Canis (lupus) familiaris)
  console.log(common.audio.ogg) // => http://d1vjc5dkcd3yh2.cloudfront.net/audio_ogg/10ce3f5eb7b4a9a03c4dafce2af60e28.ogg
})
```

## there is a command line interface

arguments:

```sh
# with none of these passed, it will return all three
-w        return words
-s        return sentences
-n        return names

-t 'tag'  filter words by tag
```

```sh
# get the kanji for the first common word matching 'neko'
$ jishon neko -wt 'common word' | jq -r '.[0].japanese'
猫

# get the full name of the first suziki returned
$ jishon suzuki -n  | jq -r '.[0].meanings[0].english'
Suzuki Emi (1985.9.13-)
```

## screen photographs of action

search in english:

![search in english](https://snake.dog/s/povoc/buqik.png)

search in japanese:

![search in japanese](https://snake.dog/s/ratad/rixar.png)

note that the bottom `english` meaning is japanese. the dom structure on jishon
isn't great. i'll improve that in later

ya but you can pipe it through `jq` for nice

## notes

there is an api, but it doesn't provide everything i need for the projects i'm
building with this, so now there's this. it scrapes the websites. fragile as
fuck

this will only work until `jisho.org` change their layout, but for as long as
i'm using it in my personal projects it'll stay up to date.

good luck everyone
