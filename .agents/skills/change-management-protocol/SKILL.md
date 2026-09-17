---
name: change-management-protocol
description: Mandates analysis, suggestion, and explicit confirmation before making changes, including creating a GitHub Issue, a feature branch, and raising a Pull Request.
license: Apache-2.0
---

# Change Management Protocol

Whenever a user requests any code change, feature, or bug fix:

1. **Analyze:** Inspect the codebase and dependencies first. Do not modify files yet.
2. **Suggest:** Clearly explain what needs to be changed and why.
3. **Ask User:** Ask whether to create a GitHub Issue, branch from it, and raise a Pull Request.
4. **Execute on Approval:**
   - Create issue with `gh issue create`
   - Create branch `feat/issue-<num>-<name>`
   - Implement & verify (`npm run build`)
   - Commit & push branch
   - Open PR with `gh pr create`
