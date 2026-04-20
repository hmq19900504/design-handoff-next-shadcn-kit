#!/usr/bin/env bash
set -euo pipefail

REPO_NAME=${1:-design-handoff-next-shadcn-kit}
REMOTE_URL=${2:-}

if ! command -v git >/dev/null 2>&1; then
  echo "缺少 git，请先安装 git。" >&2
  exit 1
fi

if [ ! -d .git ]; then
  git init
fi

git add .
if git diff --cached --quiet; then
  echo "没有新的改动需要提交。"
else
  git commit -m "feat: initial DHP Next shadcn kit"
fi

if [ -n "$REMOTE_URL" ]; then
  git remote remove origin >/dev/null 2>&1 || true
  git remote add origin "$REMOTE_URL"
  git branch -M main
  git push -u origin main
  echo "已推送到：$REMOTE_URL"
  exit 0
fi

if command -v gh >/dev/null 2>&1; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
  echo "已通过 GitHub CLI 创建并推送：$REPO_NAME"
else
  cat <<EOF
未检测到 GitHub CLI。请选择一种发布方式：

方式 A：安装并登录 gh
  brew install gh
  gh auth login
  npm run publish:github -- $REPO_NAME

方式 B：手动创建 GitHub 仓库后推送
  git remote add origin git@github.com:<你的账号>/$REPO_NAME.git
  git branch -M main
  git push -u origin main

方式 C：传入远程地址
  npm run publish:github -- $REPO_NAME git@github.com:<你的账号>/$REPO_NAME.git
EOF
fi
