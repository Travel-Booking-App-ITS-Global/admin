#!/bin/bash
echo "⚙️ Configuring git pull strategy..."
git config pull.rebase false

echo "⬇️ Pulling from remote repository to merge remote changes..."
git pull origin main --allow-unrelated-histories --no-edit

echo "⬆️ Pushing code to GitHub..."
git push -u origin main

echo "✅ All done! Code successfully pulled and pushed."
