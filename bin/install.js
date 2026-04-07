#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const CLAUDE_DIR = path.join(os.homedir(), ".claude");
const PKG_DIR = path.resolve(__dirname, "..");

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

function log(step, total, msg) {
  console.log(`[${step}/${total}] ${msg}`);
}

function success(msg) {
  console.log(`  ${GREEN}✓${RESET} ${msg}`);
}

function warn(msg) {
  console.log(`  ${YELLOW}⚠${RESET} ${msg}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFiles(srcDir, destDir, pattern) {
  if (!fs.existsSync(srcDir)) return 0;
  const files = fs.readdirSync(srcDir).filter((f) => {
    if (pattern) return f.match(pattern);
    return true;
  });
  files.forEach((f) => {
    const src = path.join(srcDir, f);
    const dest = path.join(destDir, f);
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      copyDirRecursive(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  });
  return files.length;
}

function copyDirRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src);
  entries.forEach((entry) => {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      // Preserve executable permission for shell scripts
      if (entry.endsWith(".sh")) {
        fs.chmodSync(destPath, 0o755);
      }
    }
  });
}

function main() {
  console.log("");
  console.log(`${BOLD}=== Claude God Setup — Global Install ===${RESET}`);
  console.log("");

  const TOTAL = 6;

  // 1. Agents
  log(1, TOTAL, "Installing agents...");
  ensureDir(path.join(CLAUDE_DIR, "agents"));
  const agentCount = copyFiles(
    path.join(PKG_DIR, "agents"),
    path.join(CLAUDE_DIR, "agents"),
    /\.md$/
  );
  success(`${agentCount} agents → ~/.claude/agents/`);

  // 2. Skills
  log(2, TOTAL, "Installing skills...");
  ensureDir(path.join(CLAUDE_DIR, "skills"));
  const skillsSrc = path.join(PKG_DIR, ".claude", "skills");
  let skillCount = 0;
  if (fs.existsSync(skillsSrc)) {
    const skills = fs
      .readdirSync(skillsSrc)
      .filter((f) => fs.statSync(path.join(skillsSrc, f)).isDirectory());
    skills.forEach((skill) => {
      copyDirRecursive(
        path.join(skillsSrc, skill),
        path.join(CLAUDE_DIR, "skills", skill)
      );
    });
    skillCount = skills.length;
  }
  success(`${skillCount} skills → ~/.claude/skills/`);

  // 3. Patterns → Rules
  log(3, TOTAL, "Installing patterns as global rules...");
  ensureDir(path.join(CLAUDE_DIR, "rules"));
  const patternCount = copyFiles(
    path.join(PKG_DIR, "patterns"),
    path.join(CLAUDE_DIR, "rules"),
    /\.md$/
  );
  success(`${patternCount} patterns → ~/.claude/rules/`);

  // 4. Hooks
  log(4, TOTAL, "Installing hooks...");
  ensureDir(path.join(CLAUDE_DIR, "hooks"));
  const hooksSrc = path.join(PKG_DIR, ".claude", "hooks");
  let hookCount = 0;
  if (fs.existsSync(hooksSrc)) {
    hookCount = copyFiles(hooksSrc, path.join(CLAUDE_DIR, "hooks"), /\.sh$/);
  }
  success(`${hookCount} hooks → ~/.claude/hooks/`);

  // 5. Global settings.json
  log(5, TOTAL, "Configuring global hooks in settings.json...");
  const settingsPath = path.join(CLAUDE_DIR, "settings.json");

  // Back up existing settings if non-empty
  if (fs.existsSync(settingsPath)) {
    const existing = fs.readFileSync(settingsPath, "utf8").trim();
    if (existing && existing !== "{}") {
      const backupPath = settingsPath + ".backup";
      fs.copyFileSync(settingsPath, backupPath);
      warn(`Existing settings backed up to ~/.claude/settings.json.backup`);
    }
  }

  const settings = {
    hooks: {
      SessionStart: [
        {
          matcher: "startup|resume",
          hooks: [
            {
              type: "command",
              command: "$HOME/.claude/hooks/env-setup.sh",
              timeout: 30,
              statusMessage: "Loading God Setup...",
            },
          ],
        },
      ],
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [
            {
              if: "Bash(git push *)",
              type: "command",
              command: "$HOME/.claude/hooks/git-push-guard.sh",
              timeout: 10,
              statusMessage: "Push safety check...",
            },
          ],
        },
        {
          matcher: "Bash",
          hooks: [
            {
              if: "Bash(git commit *)",
              type: "command",
              command: "$HOME/.claude/hooks/pre-commit-check.sh",
              timeout: 15,
              statusMessage: "Pre-commit check...",
            },
          ],
        },
        {
          matcher: "Bash",
          hooks: [
            {
              if: "Bash(rm -rf *)",
              type: "command",
              command: "$HOME/.claude/hooks/destructive-guard.sh",
              timeout: 5,
              statusMessage: "Destructive cmd check...",
            },
          ],
        },
        {
          matcher: "Bash",
          hooks: [
            {
              if: "Bash(git reset --hard *)",
              type: "command",
              command: "$HOME/.claude/hooks/destructive-guard.sh",
              timeout: 5,
              statusMessage: "Destructive git check...",
            },
          ],
        },
        {
          matcher: "Bash",
          hooks: [
            {
              if: "Bash(git push --force *)",
              type: "command",
              command: "$HOME/.claude/hooks/force-push-guard.sh",
              timeout: 5,
              statusMessage: "Force push block...",
            },
          ],
        },
      ],
      PostToolUse: [
        {
          matcher: "Edit|Write",
          hooks: [
            {
              type: "command",
              command: "$HOME/.claude/hooks/post-edit-track.sh",
              timeout: 5,
              statusMessage: "Tracking changes...",
            },
          ],
        },
      ],
      Stop: [
        {
          hooks: [
            {
              type: "command",
              command: "$HOME/.claude/hooks/stop-checklist.sh",
              timeout: 10,
              statusMessage: "Completion checklist...",
            },
          ],
        },
      ],
      Notification: [
        {
          hooks: [
            {
              type: "command",
              command: "$HOME/.claude/hooks/notify.sh",
              timeout: 5,
            },
          ],
        },
      ],
    },
  };

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  success("Global hooks configured in ~/.claude/settings.json");

  // 6. Global CLAUDE.md
  log(6, TOTAL, "Creating global CLAUDE.md...");
  const claudeMd = `# Claude God Setup (Global)

Multi-agent orchestration system. 21 agents, 15 skills, 9 hooks — available in every project.

## Model Routing

| Tier | Model | Use For |
|------|-------|---------|
| Lite | haiku | Docs, codemaps, formatting |
| Standard | sonnet | Reviews, analysis, testing, refactoring |
| Power | opus | Architecture, planning, GAN, eval, creative judgment |

**Default:** sonnet. Never opus for deterministic work. Never haiku for judgment calls.

## Auto-Trigger Rules

| Condition | Agent | Priority |
|-----------|-------|----------|
| Any code written or modified | \`code-reviewer\` | HIGH |
| .ts/.tsx/.js/.jsx files changed | \`typescript-reviewer\` | HIGH |
| .py files changed | \`python-reviewer\` | HIGH |
| Build fails or type errors | \`build-error-resolver\` | CRITICAL |
| Auth, API, DB, or payment code touched | \`security-reviewer\` | CRITICAL |
| New feature planned | \`planner\` | HIGH |
| System design decision needed | \`architect\` | HIGH |
| Feature completed | \`e2e-runner\` | MEDIUM |
| Major feature merged | \`doc-updater\` | LOW |
| Performance regression | \`performance-optimizer\` | MEDIUM |

## Quick Reference

\`\`\`
/review          /plan <feature>     /pipeline <feature>   /fix-build
/quick-fix <bug> /audit              /security-audit       /explore <area>
/optimize        /cleanup            /docs                 /pr-review <num>
/gan <prompt>    /seo-audit          /eval [project]
\`\`\`

**Direct:** \`Read agents/<name>.md and [task description]\`

## Non-Negotiable Rules

- No hardcoded secrets — use environment variables
- Parameterized queries only — never string concatenation for SQL
- Validate all user input at system boundaries
- Auth check on every protected route
`;

  fs.writeFileSync(path.join(CLAUDE_DIR, "CLAUDE.md"), claudeMd);
  success("Global CLAUDE.md created");

  // Summary
  console.log("");
  console.log(`${BOLD}=== Installation Complete ===${RESET}`);
  console.log("");
  console.log("  ~/.claude/");
  console.log(
    "  ├── CLAUDE.md          ← Global instructions (loaded every session)"
  );
  console.log("  ├── settings.json      ← Global hooks configuration");
  console.log(`  ├── agents/            ← ${agentCount} agents`);
  console.log(`  ├── skills/            ← ${skillCount} skills`);
  console.log(`  ├── rules/             ← ${patternCount} patterns (auto-loaded)`);
  console.log(`  └── hooks/             ← ${hookCount} hook scripts`);
  console.log("");
  console.log(
    "All agents, skills, hooks, and rules are now available in every project."
  );
  console.log("Run 'claude' in any directory to start using them.");
  console.log("");
}

main();
