# 🌸 Sakura Nihongo (桜日本語)
### Modern Japanese Learning Portal & JFT-Basic / JLPT 2025–2026 Master Reviewer

> **Dedicated with love by Ian for his girlfriend** ❤️  
> Built with doctoral-level master software engineering & **UI/UX PRO MAX** design aesthetics.

---

## 🌟 Overview & Highlights

**Sakura Nihongo** is a modern web application designed for comprehensive Japanese study and exam preparation for both the **JFT-Basic (Japan Foundation Test for Basic Japanese - A2.2)** and the **JLPT (Japanese-Language Proficiency Test N5 to N1)**.

### ✨ Key Features:
1. **🌸 UI/UX PRO MAX Japanese Aesthetic**:
   - Soft falling sakura (cherry blossom) petals with interactive physics (toggleable / reduced-motion friendly).
   - "Sakura Bloom" (Day Mode / 昼桜) and "Tokyo Midnight" (Dark Mode / 夜桜) dual theme system.
   - Traditional typography pairing `Noto Serif JP`, `Noto Sans JP`, and clean modern sans.
2. **🎯 Official 60-Minute CBT Exam Simulator**:
   - Realistic Prometric-style Computer-Based Testing interface with live countdown timer and question drawer.
   - 4 JFT Core Sections: **Moji to Goi** (Script & Vocab), **Kaiwa to Hyougen** (Conversation & Expression), **Choukai** (Listening Comprehension with audio speech), and **Dokkai** (Reading Comprehension).
   - Item Response Theory (IRT) scaled scoring algorithm (10–250 pts with 200 pt passing standard).
   - Official JLPT scoring with sectional cutoffs (19/60 minimum sectional requirements).
3. **🎴 3D Smart Flashcards with Spaced Repetition (SRS)**:
   - 3D perspective flip cards with Furigana show/hide toggle.
   - Leitner 5-box Spaced Repetition System (Again, Hard, Good, Easy).
   - Instant native audio pronunciation for Kanji and Hiragana.
4. **🔊 Native Japanese Speech Engine (TTS)**:
   - Built on the Web Speech API with native `ja-JP` speech synthesis for natural pronunciation across every word, sentence, and listening prompt.
5. **📖 600+ Irodori A2 & JLPT Vocabulary Bank**:
   - Searchable dictionary with category filters (Food, Housing, Work, Travel, Daily Life).
   - Furigana recall practice toggle & bookmarking system.
6. **📚 Comprehensive Grammar Library**:
   - 200+ structured grammar patterns across N5, N4, N3, N2, and N1 with romanization, usage rules, and example sentences.
7. **🌸 Kana Sound Matrix**:
   - Interactive Hiragana & Katakana matrix with Dakuten and Yoon combinations, audio playback, and mnemonic memory hooks.
8. **📋 High-Yield Cheatsheets**:
   - Visual Te-form conjugation matrix (Group 1 Godan, Group 2 Ichidan, Group 3 Irregular).
   - 10 Core Particles guide with contrasts (`は` vs `が`, `に` vs `で`).
   - Essential Japanese counters (`人, 本, 枚, 冊, 台, 匹, 階`).
9. **⏱️ Zen Pomodoro Focus Timer**:
   - 25-minute focus session / 5-minute break with 528 Hz Zen bell chime.
   - Daily Japanese Proverb (ことわざ) with romanization and wisdom insights.
10. **🔒 Credential Protected & Cloudflare Ready**:
    - Pre-configured login credentials for Ian and his girlfriend.
    - Profile customization (display name, avatar, target exam, daily goals).

---

## 🔑 Login Credentials

The application is protected with credential gating. You can use any of the pre-configured accounts or click **Quick Demo Login** on the login screen:

| Role | Username / Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Girlfriend (Default)** | `sakura@study.jp` or `girlfriend` | `sakura2026` | Sakura-chan (Target: JFT-Basic 2026) |
| **Alternative Login** | `nihongo` | `nihongo2026` | General Study Access |
| **Ian (Admin)** | `ian` or `yuzu` | `love2026` | Ian (イアン) |

---

## 🚀 Deployment

### 1. GitHub Pages (Automated CI/CD Included)
A GitHub Actions workflow is pre-configured at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
1. Go to repository **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Every push to `main` automatically builds and deploys the app to `https://yazerukun.github.io/sakura-nihongo/`!

### 2. Cloudflare Pages
This repository is 100% Cloudflare Pages compatible with included `public/_redirects` and `public/_headers`:
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages**.
2. Connect your GitHub repository `Yazerukun/sakura-nihongo`.
3. Set the build configuration:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**. Your site will be live instantly on Cloudflare edge network at `https://sakura-nihongo.pages.dev` (or your custom domain)!

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/Yazerukun/sakura-nihongo.git
cd sakura-nihongo

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## 🌸 Dedication
*Made with endless love and support by Ian for his girlfriend. You can do this! いつも応援しています！*
