module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start -p 3100",
      startServerReadyPattern: "Ready",
      url: [
        "http://localhost:3100/",
        "http://localhost:3100/projects",
        "http://localhost:3100/projects/audit-app",
        "http://localhost:3100/experience",
        "http://localhost:3100/contact",
      ],
      numberOfRuns: 3,
      settings: {
        budgetPath: "./budgets.json",
      },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: ".*",
          assertions: {
            "categories:performance": ["error", { minScore: 0.95 }],
            "categories:accessibility": ["error", { minScore: 0.95 }],
            "categories:best-practices": ["error", { minScore: 0.95 }],
            "categories:seo": ["error", { minScore: 0.95 }],
          },
        },
        {
          // Constitution II: the landing page ships at most 150 KiB of compressed JavaScript.
          matchingUrlPattern: "http://localhost:3100/$",
          assertions: {
            "resource-summary:script:size": ["error", { maxNumericValue: 153600 }],
          },
        },
      ],
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
