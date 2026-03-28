# Fix Backend Nodemon / index.js Error

**Status: In Progress**

## Steps:
- [x] Understand issue: Malformed nodemon command + missing index.js + no npm scripts.
- [x] Plan approved by user.
- [x] 1. Create `backend/src/index.ts` as standard TS entrypoint (merges server.ts logic).
- [x] 2. Edit `backend/package.json`: Fix "main", add `dev`/`build`/`start` scripts using ts-node-dev.
- [ ] 3. Test server: `cd backend &amp;&amp; npm run dev` (starts on PORT 5000 with hot reload).

**Next step:** Proceed to step 1 after confirmation.

