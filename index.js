const { Plugin } = require("powercord/entities");

module.exports = class toneindicators extends Plugin {
  async startPlugin() {
    powercord.api.commands.registerCommand({
      command: "tone",
      description: "show what a tone indicator means",
      usage: "{c} [tone indicator]",
      executor(args) {
        const tones = {
          c: "copypasta",
          cb: "clickbait",

          ex: "for example",
          fex: "for example",

          f: "fake",

          gen: "genuine question",

          hj: "half-joking",
          hyp: "hyperbole",

          ij: "inside joke",

          j: "joking",

          lh: "lighthearted",
          li: "literally",

          lyrics: "lyrics of a song",
          lyric: "lyrics of a song",
          ly: "lyrics of a song",

          neg: "negative connotation",
          nc: "negative connotation",

          nsrs: "not serious",
          nm: "not mad or upset",
          nbh: "nobody here (used in vague vents)",

          nsx: "non-sexual intent",
          nx: "non-sexual intent",

          p: "platonic",

          pos: "positive connotation",
          pc: "positive connotation",

          q: "quote",

          r: "romantic",
          rh: "rhetorical question",

          s: "sarcasm",
          srs: "serious",

          t: "teasing",
          th: "threat",

          x: "sexual intent",
          sx: "sexual intent",
        };

        return {
          send: false,
          result: `${
            tones[args[0]] ??
            "I couldn't find that tone tag! Feel free to make a PR with it on my GitHub repo: <https://github.com/Lisenaaaa/powercord-toneindicators>"
          }`,
        };
      },
    });
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand("tone");
  }
};
