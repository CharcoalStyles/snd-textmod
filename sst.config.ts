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
    const dbCache = new sst.aws.Dynamo("DbCache", {
      fields: {
        dbTable: "string",
        dbQuery: "string",
        // data: "string",
        // ttl: "number",
      },
      primaryIndex: { hashKey: "dbTable", rangeKey: "dbQuery" },
      ttl: "ttl",
    });

    const modCache = new sst.aws.Dynamo("ModCache", {
      fields: {
        type: "string",
        id: "string",
      },
      primaryIndex: { hashKey: "type", rangeKey: "id" },
    });

    new sst.aws.Nextjs("SndTextmodSite", {
      invalidation: false,
      link: [dbCache, modCache],
    });
  },
});
