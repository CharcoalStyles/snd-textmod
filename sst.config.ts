/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "snd-textmod",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",

    };
  },
  async run() {
    new sst.aws.Nextjs("SndTextmodSite", {
      domain: $app.stage === 'production' ? "snd-textmod.charcoalstyles.com" : undefined,
    });
  },
});
