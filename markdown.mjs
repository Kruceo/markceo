import { numListElement } from './src/types/numlist.mjs'
import { header3Element } from './src/types/header3.mjs'
import { header2Element } from './src/types/header2.mjs'
import { header1Element } from './src/types/header1.mjs'
import { lineElement } from './src/types/line.mjs'
import { dotListElement } from './src/types/dotlist.mjs'
import { quoteElement } from './src/types/quote.mjs'
import { codeBlockElement } from './src/types/codeBlock.mjs'
import { boldElement } from './src/types/bold.mjs'
import { italicElement } from './src/types/italic.mjs'
import { italicBoldElement } from './src/types/italicBold.mjs'
import { inlineCodeElement } from './src/types/inlineCode.mjs'
import { imageElement } from './src/types/image.mjs'
import { anchorElement } from './src/types/anchor.mjs'
import { emojiElement } from './src/types/emoji.mjs'
// import { emojiElement } from './src/types/emoji.mjs'
class Regex {
    constructor(firstSymbol,content, lastSymbol, callback) {
        this.firstSymbol = firstSymbol
        this.content = content
        this.lastSymbol = lastSymbol
        this.callback = callback
    }

    get exp() {
        return new RegExp(this.firstSymbol + this.content + this.lastSymbol, 'g')
    }

    applyToString(string) {
        let newString = string + ''

        const match = newString.match(this.exp)
        if (match)
            match.forEach((each, index) => {
                let literalFirstSymbol = each.match(new RegExp(this.firstSymbol))
                let literalLastSymbol = each.match(new RegExp(this.lastSymbol))
                let content = each.slice(literalFirstSymbol[0].length, each.length - literalLastSymbol[0].length)

                const result = this.callback(literalFirstSymbol, literalLastSymbol, content)
                newString = newString.replace(each, result)

                console.log('index   |', index)
                console.log('exp     |', this.exp)
                console.log('first   |', literalFirstSymbol[0])
                console.log('last    |', literalLastSymbol[0])
                console.log('content |', content)
                console.log('input   |', each)
                console.log('result  |', result.replaceAll('\n', ''))
                // console.log('all     |',newString)
                console.log('--------------------------------')
            })
        return newString
    }
}

export function parse(string) {
    const NEWLINE = "@NEWLINE@"
    const TABLEPIPE = "@TABLEPIPE@"
    let raw = ('\n' + string + '\n')
        .replaceAll('|\n|', TABLEPIPE)

        .replace(/(\-|\d\.).*?\n/g,(match)=>match.replace(/\n/,NEWLINE + NEWLINE))
        
        .replaceAll('\n',NEWLINE)
        .replaceAll('<script', '&lt; script')
        .replaceAll('</script', '&gt; script')
        .replaceAll('javascript:', 'JavaScript')
    /**
     * All that uses NEWLINE like termination, runs first in the array,columns runs first than all
     */
    const regexList = [

        new Regex(NEWLINE + '\\`\\`\\`.*?' + NEWLINE,     ".*?"     , '\\`\\`\\`'                   , codeBlockElement),
        new Regex('\\`'                             ,     ".*?"     , '\\`'                     ,     inlineCodeElement),
        new Regex(NEWLINE + '### '                  ,     ".*?"     , `(###${NEWLINE}|${NEWLINE})`,   header3Element),
        new Regex(NEWLINE + '## '                   ,     ".*?"     , `(##${NEWLINE}|${NEWLINE})`,    header2Element),
        new Regex(NEWLINE + '# '                    ,     ".*?"     , `(#${NEWLINE}|${NEWLINE})`,     header1Element),
        new Regex(NEWLINE + '--'                    ,     ".*?"     , "-" + NEWLINE,                  lineElement),
        new Regex(NEWLINE + '\\d\\.?'               ,     ".*?"     , NEWLINE,                        numListElement),
        new Regex("("+NEWLINE + "\\s*?\\-)"         ,     "[^\\-]*?", NEWLINE,            dotListElement),
        
        new Regex('\\*\\*\\*'                       ,     ".*?"     , '\\*\\*\\*',                    italicBoldElement),
        new Regex('\\*\\*'                          ,     ".*?"     , '\\*\\*',                       boldElement),
        new Regex('\\*'                             ,     ".*?"     , '\\*',                          italicElement),
        new Regex(NEWLINE + '(\\&gt;|>)'            ,     ".*?"     , NEWLINE,                        quoteElement),
        new Regex('\\!\\[.*?\\]\\('                 ,     ".*?"     , "\\)",                imageElement),
        new Regex('\\[.*?\\]\\('                    ,     ".*?"     , "\\)",                          anchorElement),
        new Regex('\\* '                            ,     ".*?"     , NEWLINE,                        dotListElement),
        new Regex('_'                             ,     ".*?"     , '\\_'                     ,       italicElement),

        new Regex('\\:',"[\\w]+", "\\:", emojiElement),
    ]

    regexList.forEach((each, index) => {
        raw = each.applyToString(raw);
    })
    return "<div id=\"markdown\" class=\"background\">" + raw.replaceAll(NEWLINE, "\n") + "\n</div>"

}