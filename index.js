const { Plugin } = require("powercord/entities");

module.exports = class toneindicators extends Plugin {
  async startPlugin() {
    powercord.api.commands.registerCommand({
      command: "tone",
      description: "show what a tone indicator means",
      usage: "{c} [tone indicator]",
      executor(args) {
        const tones = {
          j: "joking",
          hj: "half-joking",
          ij: "inside joke",
          s: "sarcasm",
          srs: "serious",
          nsrs: "not serious",
          p: "platonic",
          r: "romantic",
          lh: "lighthearted",
          neg: "negative connotation",
          nc: "negative connotation",
          pos: "positive connotation",
          pc: "positive connotation",
          rh: "rhetorical question",
          gen: "genuine question",
          hyp: "hyperbole",
          c: "copypasta",
          q: "quote",
          lyrics: "lyrics of a song",
          lyric: "lyrics of a song",
          ly: "lyrics of a song",
          f: "fake",
          th: "threat",
          li: "literally",
          nm: "not mad or upset",
          t: "teasing",
          nbh: "nobody here (used in vague vents)",
          cb: "clickbait",
          ex: "example , for example",
          fex: "example , for example",
          sx: "sexual intent",
          x: "sexual intent",
          nsx: "non-sexual intent",
          nx: "non-sexual intent",
        };

        return {
          send: false,
          result: `${tones[args[0]] ?? "I couldn't find that tone tag! Feel free to make a PR with it on my GitHub repo: <https://github.com/Lisenaaaa/powercord-toneindicators>"}`,
        };
      },
    });
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand("tone");
  }
};
