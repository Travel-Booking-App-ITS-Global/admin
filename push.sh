#!/bin/bash
echo "🚀 Initializing Git repository..."
git init

echo "📦 Adding files..."
git add .

echo "💾 Committing changes..."
git commit -m "feat: complete settings UI overhaul and profile vault"

echo "🌿 Setting main branch..."
git branch -M main

echo "🔗 Connecting to remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Travel-Booking-App-ITS-Global/admin.git

echo "⬆️ Pushing code to GitHub..."
git push -u origin main

echo "✅ Done!"
