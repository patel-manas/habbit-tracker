<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Development & Change Management Workflow

## ⚠️ MANDATORY RULE: Change Analysis & GitHub Issue/PR Protocol

Whenever the developer asks to make any code change, feature addition, bug fix, or refactor in this repository, you **MUST** strictly adhere to the following 4-step protocol before directly pushing or applying unapproved modifications:

---

### Step 1: Analyze
- Thoroughly inspect the existing code, components, Firebase data layer, and styling tokens.
- Identify the exact files, state flows, and potential side effects.
- Do NOT make source code changes during this step.

---

### Step 2: Suggest & Explain
- Provide a clear, concise summary of your analysis.
- Detail:
  - What needs to be changed.
  - Which files will be created, modified, or deleted.
  - Why this approach fits the architecture and design tokens.

---

### Step 3: Ask the Developer
Before creating branches or modifying code, ask the user explicitly:
> *"Should I create a GitHub Issue for this task, create a dedicated feature branch for it, and raise a Pull Request once the changes are verified?"*

Present the proposed:
- **Issue Title & Summary**
- **Branch Name** (e.g., `feat/issue-X-<slug>` or `fix/issue-X-<slug>`)

---

### Step 4: Execute & Raise Pull Request (Upon Approval)
Once the developer confirms:
1. **Create GitHub Issue:**
   ```bash
   gh issue create --title "<Title>" --body "<Description>"
   ```
2. **Create & Checkout Feature Branch:**
   ```bash
   git checkout -b feat/issue-<issue-number>-<slug>
   ```
3. **Implement Changes & Verify:**
   - Make the approved changes cleanly.
   - Run verification and build:
     ```bash
     npm run build
     ```
4. **Commit & Push Branch:**
   ```bash
   git add <modified-files>
   git commit -m "<type>(#<issue-number>): <concise message>"
   git push -u origin feat/issue-<issue-number>-<slug>
   ```
5. **Raise Pull Request:**
   ```bash
   gh pr create --base main --title "<type>: <title>" --body "Resolves #<issue-number>. Detailed summary of changes..."
   ```
6. Provide the clickable Pull Request link to the developer.

---

## Technical Stack Guidelines
- **Framework:** Next.js (App Router, TypeScript, Tailwind CSS, Static Export `output: 'export'`)
- **Backend & Auth:** Firebase Auth + Cloud Firestore + localStorage resilience
- **Deployment:** Firebase Hosting (`habbit-tracker-manas-2026.web.app`) via GitHub Actions CI/CD pipeline on merge to `main`.
- **Branch Policy:** `main` is protected. All production changes must be merged via Pull Requests.
