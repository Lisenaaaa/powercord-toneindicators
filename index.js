const { Plugin } = require("powercord/entities")
const { inject, uninject } = require("powercord/injector")
const { React, getModuleByDisplayName, getModule } = require("powercord/webpack")

const tones = {
  a: "alterous",
  ay: "at you",
  c: "copypasta",
  cb: "clickbait",
  f: "fake",
  g: "genuine / genuine question",
  gen: "genuine / genuine question",
  hj: "half joking",
  hyp: "hyperbole",
  ij: "inside joke",
  j: "joking",
  l: "lyrics",
  lh: "light hearted",
  li: "literal / literally",
  lu: "a little upset",
  ly: "lyrics",
  m: "metaphor / metaphorically",
  nay: "not at you",
  nbh: "nobody here",
  nbr: "not being rude",
  nc: "negative connotation",
  neg: "negative connotation",
  neu: "neutral / neutral connotation",
  nf: "not forced",
  nm: "not mad",
  ns: "non-sexual intent",
  nsb: "not subtweeting",
  nsrs: "not serious",
  nsx: "non-sexual intent",
  ot: "off topic",
  p: "platonic",
  pc: "positive connotation",
  pos: "positive connotation",
  q: "quote",
  r: "romantic",
  ref: "reference",
  rh: "rhetorical question",
  rt: "rhetorical question",
  s: "sarcastic / sarcasm",
  sarc: "sarcastic / sarcasm",
  srs: "serious",
  sx: "sexual intent",
  t: "teasing",
  th: "threat",
  x: "sexual intent"
}

module.exports = class ToneIndicators extends Plugin {
  async startPlugin() {
    await this.injectMessageContextMenu()
    powercord.api.commands.registerCommand({
      command: "tone",
      description: "show what a tone indicator means",
      usage: "{c} [tone indicator]",
      executor: (args) => {
        return {
          send: false,
          result: `${
            tones[args[0]] ??
            "I couldn't find that tone tag! Feel free to make a PR with it on my GitHub repo: <https://github.com/Lisenaaaa/powercord-toneindicators>"
          }`,
        }
      }
    })
  }

  pluginWillUnload() {
    uninject(`${this.entityID}-messagectxmenu`)
    powercord.api.commands.unregisterCommand("tone")
  }

  get generateToastId() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '');
  }

  async injectMessageContextMenu() {
    await this.lazyPatchContextMenu("MessageContextMenu", async (MessageContextMenu) => {
      const Menu = await getModule([ "MenuItem" ])

      const injectButtonFunction = (args, res) => {
        const selected = document.getSelection().toString().trim().replace("/", "").toLowerCase()
        if (!(selected && selected in tones)) return res

        const openToast = () => powercord.api.notices.sendToast(this.generateToastId, {
          header: `/${selected} -  ${tones[selected]}`,
          timeout: 3000
        })

        const toneIndicatorBtn = React.createElement(Menu.MenuItem, {
          action: openToast,
          id: "message-tone-indicator",
          label: "Tone Indicator"
        })

        const messageContextMenuItems = res.props.children
        messageContextMenuItems.push(React.createElement(Menu.MenuGroup, {}, toneIndicatorBtn))

        return res
      }

      inject(`${this.entityID}-messagectxmenu`, MessageContextMenu, "default", injectButtonFunction)
      MessageContextMenu.default.displayName = "MessageContextMenu"
    })
  }

  // Credit to SammCheese 
  async lazyPatchContextMenu(displayName, patch) {
    const filter = m => m.default && m.default.displayName === displayName
    const m = getModule(filter, false)

    if (m) patch(m)
    else {
      const module = getModule([ "openContextMenuLazy" ], false)
      inject(`${this.entityID}-rm-lazy-contextmenu`, module, "openContextMenuLazy", args => {
        const lazyRender = args[1]
        args[1] = async () => {
          const render = await lazyRender(args[0])

          return (config) => {
            const menu = render(config)
            if (menu?.type?.displayName === displayName && patch) {
              uninject(`${this.entityID}-rm-lazy-contextmenu`)
              patch(getModule(filter, false))
              patch = false
            }
            return menu
          }
        }
        return args
      }, true)
    }
  }
}