# 发布到 GitHub

我无法替你直接获得 GitHub 写权限，因此本仓库提供发布脚本。

## 方式 A：使用 GitHub CLI

```bash
brew install gh
# 或参考 GitHub CLI 官方安装方式

gh auth login
npm run publish:github -- design-handoff-next-shadcn-kit
```

## 方式 B：手动创建仓库后推送

先在 GitHub 上创建空仓库，然后执行：

```bash
git init
git add .
git commit -m "feat: initial DHP Next shadcn kit"
git branch -M main
git remote add origin git@github.com:<你的账号>/design-handoff-next-shadcn-kit.git
git push -u origin main
```

## 方式 C：传入远程地址

```bash
npm run publish:github -- design-handoff-next-shadcn-kit git@github.com:<你的账号>/design-handoff-next-shadcn-kit.git
```

## 发布前检查

```bash
npm run verify:offline
npm install
npm run typecheck
npm run web:build
```
