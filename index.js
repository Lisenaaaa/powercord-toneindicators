const { Plugin } = require("powercord/entities")
const { inject, uninject } = require("powercord/injector")
const { React, getModuleByDisplayName, getModule } = require("powercord/webpack")

const tones = {
  a: "Alterous.",
  ay: "At you.",
  c: "Copypasta.",
  cb: "Clickbait.",
  f: "Fake.",
  g: "Genuine / Genuine question.",
  gen: "Genuine / Genuine question.",
  hj: "Half joking.",
  hsrs: "Half serious.",
  hyp: "Hyperbole.",
  ij: "Inside joke.",
  j: "Joking.",
  l: "Lyrics.",
  lh: "Light hearted.",
  li: "Literal / Literally.",
  lu: "A little upset.",
  ly: "Lyrics.",
  m: "Metaphor / Metaphorically.",
  nay: "Not at you.",
  nbh: "Nobody here.",
  nbr: "Not being rude.",
  nc: "Negative connotation.",
  neg: "Negative connotation.",
  neu: "Neutral / Neutral connotation.",
  nf: "Not forced.",
  nm: "Not mad.",
  ns: "Non-sexual intent.",
  nsb: "Not subtweeting.",
  nsrs: "Not serious.",
  nsx: "Non-sexual intent.",
  ot: "Off topic.",
  p: "Platonic.",
  pc: "Positive connotation.",
  pos: "Positive connotation.",
  q: "Quote.",
  r: "Romantic.",
  ref: "Reference.",
  rh: "Rhetorical question.",
  rt: "Rhetorical question.",
  s: "Sarcastic / Sarcasm.",
  sarc: "Sarcastic / Sarcasm.",
  srs: "Serious.",
  sx: "Sexual intent.",
  t: "Teasing.",
  th: "Threat.",
  x: "Sexual intent."
}

module.exports = class ToneIndicators extends Plugin {
  async startPlugin() {
    await this.injectMessageContextMenu()
    powercord.api.commands.registerCommand({
      command: "tone",
      description: "Show what a tone indicator means.",
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
