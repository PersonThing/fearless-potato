#!/usr/bin/env bash
set -e

echo "=== Fearless Potato Setup ==="
echo ""

if [ -f "backend/.env" ]; then
  echo "backend/.env already exists. Skipping key setup."
else
  echo "Which LLM provider do you want to use?"
  echo ""
  echo "  1) Anthropic (Claude)"
  echo "  2) OpenAI (GPT-4o)"
  echo "  3) Google (Gemini)"
  echo ""
  read -rp "Enter 1, 2, or 3: " PROVIDER

  case "$PROVIDER" in
    1)
      read -rp "Paste your Anthropic API key: " KEY
      echo "ANTHROPIC_API_KEY=$KEY" > backend/.env
      ;;
    2)
      read -rp "Paste your OpenAI API key: " KEY
      echo "OPENAI_API_KEY=$KEY" > backend/.env
      ;;
    3)
      read -rp "Paste your Gemini API key: " KEY
      echo "GEMINI_API_KEY=$KEY" > backend/.env
      ;;
    *)
      echo "Invalid choice. Exiting."
      exit 1
      ;;
  esac

  echo "Created backend/.env"
fi

echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "=== Done! ==="
echo "Run: npm run dev"
echo "Open: http://localhost:5173"
echo "Press Ctrl+K to create your first slide."
