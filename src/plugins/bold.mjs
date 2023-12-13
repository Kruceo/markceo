import Plugin from "../lib/Plugin.mjs"
import Regex from "../lib/Regex.mjs"

function boldElement(first, last, content) {
    return `<span style="font-weight:bold" class="markdown bold">${content}</span>`
}

export const bold = new Plugin([
    new Regex('\\*\\*(?! )', `.*?(?!\n)`, `\\*\\*`, boldElement),
    new Regex(`(?= |\\b)__`, ".+?", '__(?= |\\b)', boldElement),
])