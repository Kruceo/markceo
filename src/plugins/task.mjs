import Plugin from "../lib/Plugin.mjs"

function taskElement(first, content, last) {
    const checked = content == 'x'
    return `<span class="markdown task ${checked ? 'checked' : ''}"><div id="markdown" class="inner"></div></span>`
}

export const task = new Plugin(/\[/,/(x| )/,/\]/,'task', taskElement)