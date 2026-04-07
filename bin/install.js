#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const CLAUDE_DIR = path.join(os.homedir(), ".claude");
const PKG_DIR = path.resolve(__dirname, "..");

// ── Colors ────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  // Foreground
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  // Bright foreground
  bRed: "\x1b[91m",
  bGreen: "\x1b[92m",
  bYellow: "\x1b[93m",
  bBlue: "\x1b[94m",
  bMagenta: "\x1b[95m",
  bCyan: "\x1b[96m",
  bWhite: "\x1b[97m",
  // Background
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
};

// ── ASCII Art ─────────────────────────────────────────────
function printBanner() {
  const gold = c.bYellow;
  const cyan = c.bCyan;
  const mag = c.bMagenta;
  const bGreen = c.bGreen;
  const white = c.bWhite;
  const dim = c.dim;
  const r = c.reset;

  console.log("");
  console.log(
    `${gold}                    ⚡                                          ${r}`
  );
  console.log(
    `${gold}                   ⚡⚡⚡                                        ${r}`
  );
  console.log(
    `${gold}                  ⚡⚡⚡⚡⚡                                       ${r}`
  );
  console.log(
    `${gold}                 ⚡⚡⚡${white}█████${gold}⚡⚡⚡                                    ${r}`
  );
  console.log(
    `${gold}                ⚡⚡${white}███████████${gold}⚡⚡                                   ${r}`
  );
  console.log(
    `${gold}               ⚡${white}█████████████████${gold}⚡                                  ${r}`
  );
  console.log(
    `${gold}              ⚡${white}███${cyan}▓▓▓▓▓▓▓▓▓▓▓${white}███${gold}⚡                                 ${r}`
  );
  console.log(
    `${gold}             ⚡${white}██${cyan}▓▓▓${mag}◆${cyan}▓▓▓▓▓▓▓${mag}◆${cyan}▓▓▓${white}██${gold}⚡            ${dim}The All-Seeing Eye${r}`
  );
  console.log(
    `${gold}            ⚡${white}██${cyan}▓▓▓▓▓▓▓${mag}◈${cyan}▓▓▓▓▓▓▓${white}██${gold}⚡           ${dim}of Code Quality${r}`
  );
  console.log(
    `${gold}             ⚡${white}██${cyan}▓▓▓${mag}◆${cyan}▓▓▓▓▓▓▓${mag}◆${cyan}▓▓▓${white}██${gold}⚡                                 ${r}`
  );
  console.log(
    `${gold}              ⚡${white}███${cyan}▓▓▓▓▓▓▓▓▓▓▓${white}███${gold}⚡                                 ${r}`
  );
  console.log(
    `${gold}               ⚡${white}█████████████████${gold}⚡                                  ${r}`
  );
  console.log(
    `${gold}              ⚡⚡⚡${white}█████████████${gold}⚡⚡⚡                                  ${r}`
  );
  console.log(
    `${gold}             ⚡⚡⚡⚡⚡${white}█████████${gold}⚡⚡⚡⚡⚡                                  ${r}`
  );
  console.log(
    `${gold}            ⚡⚡⚡⚡⚡⚡⚡${white}█████${gold}⚡⚡⚡⚡⚡⚡⚡                                  ${r}`
  );
  console.log(
    `${gold}           ⚡⚡⚡⚡⚡⚡⚡⚡⚡${white}█${gold}⚡⚡⚡⚡⚡⚡⚡⚡⚡                                  ${r}`
  );
  console.log("");
  console.log("");

  // Title
  console.log(
    `${mag}  ██████╗${cyan} ██████╗ ${gold}██████╗ ${r}    ${mag}███████╗${cyan}███████╗${gold}████████╗${white}██╗   ██╗${bGreen}██████╗ ${r}`
  );
  console.log(
    `${mag} ██╔════╝${cyan}██╔═══██╗${gold}██╔══██╗${r}    ${mag}██╔════╝${cyan}██╔════╝${gold}╚══██╔══╝${white}██║   ██║${bGreen}██╔══██╗${r}`
  );
  console.log(
    `${mag} ██║  ███${cyan}██║   ██║${gold}██║  ██║${r}    ${mag}███████╗${cyan}█████╗  ${gold}   ██║   ${white}██║   ██║${bGreen}██████╔╝${r}`
  );
  console.log(
    `${mag} ██║   ██${cyan}██║   ██║${gold}██║  ██║${r}    ${mag}╚════██║${cyan}██╔══╝  ${gold}   ██║   ${white}██║   ██║${bGreen}██╔═══╝ ${r}`
  );
  console.log(
    `${mag} ╚██████╔${cyan}╚██████╔╝${gold}██████╔╝${r}    ${mag}███████║${cyan}███████╗${gold}   ██║   ${white}╚██████╔╝${bGreen}██║     ${r}`
  );
  console.log(
    `${mag}  ╚═════╝${cyan} ╚═════╝ ${gold}╚═════╝ ${r}    ${mag}╚══════╝${cyan}╚══════╝${gold}   ╚═╝   ${white} ╚═════╝ ${bGreen}╚═╝     ${r}`
  );
  console.log("");
  console.log(
    `${dim}  ─────────────────────────────────────────────────────────────────${r}`
  );
  console.log(
    `${white}${c.bold}   Multi-Agent Orchestration System for Claude Code${r}`
  );
  console.log(
    `${dim}   21 Agents  •  15 Skills  •  9 Hooks  •  3 Rules${r}`
  );
  console.log(
    `${dim}  ─────────────────────────────────────────────────────────────────${r}`
  );
  console.log("");
}

// ── Progress Bar ──────────────────────────────────────────
function progressBar(step, total, label) {
  const filled = Math.round((step / total) * 30);
  const empty = 30 - filled;
  const bar = `${c.bCyan}${"█".repeat(filled)}${c.dim}${"░".repeat(empty)}${c.reset}`;
  const pct = Math.round((step / total) * 100);
  console.log(
    `  ${bar} ${c.bWhite}${pct}%${c.reset}  ${c.bold}${label}${c.reset}`
  );
}

function stepHeader(step, total, emoji, label) {
  console.log("");
  console.log(
    `  ${c.bCyan}[${step}/${total}]${c.reset} ${emoji}  ${c.bold}${label}${c.reset}`
  );
}

function success(msg) {
  console.log(`         ${c.bGreen}✓${c.reset} ${msg}`);
}

function warn(msg) {
  console.log(`         ${c.bYellow}⚠${c.reset} ${msg}`);
}

// ── File Operations ───────────────────────────────────────
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
      if (entry.endsWith(".sh")) {
        fs.chmodSync(destPath, 0o755);
      }
    }
  });
}

// ── Main ──────────────────────────────────────────────────
function main() {
  printBanner();

  const TOTAL = 6;

  // 1. Agents
  stepHeader(1, TOTAL, "🤖", "Installing Agents");
  ensureDir(path.join(CLAUDE_DIR, "agents"));
  const agentCount = copyFiles(
    path.join(PKG_DIR, "agents"),
    path.join(CLAUDE_DIR, "agents"),
    /\.md$/
  );
  success(`${c.bWhite}${agentCount}${c.reset} agents → ${c.dim}~/.claude/agents/${c.reset}`);
  progressBar(1, TOTAL, "Agents ready");

  // 2. Skills
  stepHeader(2, TOTAL, "⚡", "Installing Skills");
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
  success(`${c.bWhite}${skillCount}${c.reset} skills → ${c.dim}~/.claude/skills/${c.reset}`);
  progressBar(2, TOTAL, "Skills ready");

  // 3. Patterns → Rules
  stepHeader(3, TOTAL, "📜", "Installing Rules & Patterns");
  ensureDir(path.join(CLAUDE_DIR, "rules"));
  const patternCount = copyFiles(
    path.join(PKG_DIR, "patterns"),
    path.join(CLAUDE_DIR, "rules"),
    /\.md$/
  );
  success(`${c.bWhite}${patternCount}${c.reset} patterns → ${c.dim}~/.claude/rules/${c.reset} ${c.dim}(auto-loaded)${c.reset}`);
  progressBar(3, TOTAL, "Rules ready");

  // 4. Hooks
  stepHeader(4, TOTAL, "🛡️", "Installing Safety Hooks");
  ensureDir(path.join(CLAUDE_DIR, "hooks"));
  const hooksSrc = path.join(PKG_DIR, ".claude", "hooks");
  let hookCount = 0;
  if (fs.existsSync(hooksSrc)) {
    hookCount = copyFiles(hooksSrc, path.join(CLAUDE_DIR, "hooks"), /\.sh$/);
  }
  success(`${c.bWhite}${hookCount}${c.reset} hooks → ${c.dim}~/.claude/hooks/${c.reset}`);
  progressBar(4, TOTAL, "Hooks ready");

  // 5. Global settings.json
  stepHeader(5, TOTAL, "⚙️", "Configuring Global Settings");
  const settingsPath = path.join(CLAUDE_DIR, "settings.json");

  if (fs.existsSync(settingsPath)) {
    const existing = fs.readFileSync(settingsPath, "utf8").trim();
    if (existing && existing !== "{}") {
      const backupPath = settingsPath + ".backup";
      fs.copyFileSync(settingsPath, backupPath);
      warn(`Existing settings backed up to ${c.dim}~/.claude/settings.json.backup${c.reset}`);
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
  success(`Global hooks → ${c.dim}~/.claude/settings.json${c.reset}`);
  progressBar(5, TOTAL, "Settings configured");

  // 6. Global CLAUDE.md
  stepHeader(6, TOTAL, "📋", "Creating Global Instructions");
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
  success(`Global instructions → ${c.dim}~/.claude/CLAUDE.md${c.reset}`);
  progressBar(6, TOTAL, "All done!");

  // ── Summary ─────────────────────────────────────────────
  console.log("");
  console.log(
    `  ${c.dim}─────────────────────────────────────────────────────────────────${c.reset}`
  );
  console.log("");
  console.log(
    `  ${c.bGreen}${c.bold}  ✅  INSTALLATION COMPLETE${c.reset}`
  );
  console.log("");
  console.log(
    `  ${c.dim}  ~/.claude/${c.reset}`
  );
  console.log(
    `  ${c.dim}  ├──${c.reset} ${c.bWhite}CLAUDE.md${c.reset}          ${c.dim}Global instructions${c.reset}`
  );
  console.log(
    `  ${c.dim}  ├──${c.reset} ${c.bWhite}settings.json${c.reset}      ${c.dim}Hooks configuration${c.reset}`
  );
  console.log(
    `  ${c.dim}  ├──${c.reset} ${c.bCyan}agents/${c.reset}             ${c.bWhite}${agentCount}${c.reset} ${c.dim}AI agents${c.reset}`
  );
  console.log(
    `  ${c.dim}  ├──${c.reset} ${c.bMagenta}skills/${c.reset}             ${c.bWhite}${skillCount}${c.reset} ${c.dim}slash commands${c.reset}`
  );
  console.log(
    `  ${c.dim}  ├──${c.reset} ${c.bYellow}rules/${c.reset}              ${c.bWhite}${patternCount}${c.reset} ${c.dim}auto-loaded patterns${c.reset}`
  );
  console.log(
    `  ${c.dim}  └──${c.reset} ${c.bRed}hooks/${c.reset}              ${c.bWhite}${hookCount}${c.reset} ${c.dim}safety guards${c.reset}`
  );
  console.log("");
  console.log(
    `  ${c.dim}─────────────────────────────────────────────────────────────────${c.reset}`
  );
  console.log("");
  console.log(
    `  ${c.bWhite}${c.bold}  Quick Commands:${c.reset}`
  );
  console.log("");
  console.log(
    `     ${c.bCyan}/review${c.reset}          ${c.dim}Full code review pipeline${c.reset}`
  );
  console.log(
    `     ${c.bCyan}/plan${c.reset} ${c.dim}<feature>${c.reset}   ${c.dim}Create implementation plan${c.reset}`
  );
  console.log(
    `     ${c.bCyan}/pipeline${c.reset} ${c.dim}<feat>${c.reset}  ${c.dim}Full dev pipeline: explore → docs${c.reset}`
  );
  console.log(
    `     ${c.bCyan}/gan${c.reset} ${c.dim}<prompt>${c.reset}     ${c.dim}Build app from a one-line prompt${c.reset}`
  );
  console.log(
    `     ${c.bCyan}/eval${c.reset} ${c.dim}[project]${c.reset}  ${c.dim}Generate Langfuse eval pipeline${c.reset}`
  );
  console.log(
    `     ${c.bCyan}/audit${c.reset}           ${c.dim}Run all quality gates${c.reset}`
  );
  console.log(
    `     ${c.bCyan}/security-audit${c.reset}   ${c.dim}OWASP Top 10 + secrets scan${c.reset}`
  );
  console.log("");
  console.log(
    `  ${c.dim}  Run ${c.bWhite}claude${c.dim} in any directory to start using God Setup.${c.reset}`
  );
  console.log("");
  console.log(
    `  ${c.dim}─────────────────────────────────────────────────────────────────${c.reset}`
  );

  // ── Creator ─────────────────────────────────────────────
  console.log("");
  console.log(
    `  ${c.bYellow}⚡${c.reset} ${c.bold}Created by ${c.bWhite}Abhisek Bose${c.reset}`
  );
  console.log(
    `  ${c.dim}  LinkedIn: ${c.bCyan}${c.underline}https://www.linkedin.com/in/abhisek-bose/${c.reset}`
  );
  console.log(
    `  ${c.dim}  GitHub:   ${c.bCyan}${c.underline}https://github.com/iabhisekbosepm/claude-god-setup${c.reset}`
  );
  console.log("");
  console.log(
    `  ${c.bYellow}★${c.reset} ${c.dim}Star the repo if God Setup helps your workflow!${c.reset}`
  );
  console.log("");
}

main();
