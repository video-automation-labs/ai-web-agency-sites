#!/bin/bash
# ai-web-agency-sites 自動セーブポイント
# fswatch でファイル変更を検知 → 即 git commit

REPO_DIR="/Users/kobayashiyuuki/ai-web-agency-sites"
cd "$REPO_DIR" || exit 1

commit_changes() {
  if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
    git add -A
    git commit -m "auto: save point $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
    echo "[$(date '+%H:%M:%S')] Pushed to GitHub."
  fi
}

echo "Watching $REPO_DIR ..."

fswatch -r \
  --exclude "\.git" \
  --exclude "\.DS_Store" \
  "$REPO_DIR" | while read -r event; do
    commit_changes
done
