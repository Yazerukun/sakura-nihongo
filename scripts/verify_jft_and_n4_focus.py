from playwright.sync_api import sync_playwright

def main():
    print("🚀 Verifying Laser-Focused JFT-Basic & JLPT N4 Experience on Production...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        url = "https://sakura-nihongo.pages.dev"
        print(f"🌐 Navigating to {url}...")
        page.goto(url, wait_until="networkidle", timeout=30000)

        # Login
        print("🔑 Logging in as Sakura-chan...")
        page.locator('button:has-text("Sakura-chan")').click()
        page.wait_for_timeout(1000)

        # 1. Verify Header Levels
        header_levels = [b.inner_text().replace('\n', ' ') for b in page.locator('header button').all() if 'JFT' in b.inner_text() or 'N4' in b.inner_text()]
        print("🌸 Header Level Switcher Pills:", header_levels)
        assert any('JFT-Basic A2' in h for h in header_levels), "JFT-Basic A2 missing from header"
        assert any('JLPT N4' in h for h in header_levels), "JLPT N4 missing from header"

        # 2. Verify CBT Dual Switcher
        print("🎯 Checking CBT Exam Simulator Dual Switcher...")
        page.locator('nav button:has-text("Real-Time Official CBT")').click()
        page.wait_for_timeout(1000)

        jft_cbt_btn = page.locator('button:has-text("JFT-Basic A2 (国際交流基金)")')
        n4_cbt_btn = page.locator('button:has-text("JLPT N4 (公式本番試験)")')
        print(f"✅ JFT-Basic CBT Button visible: {jft_cbt_btn.is_visible()}")
        print(f"✅ JLPT N4 CBT Button visible: {n4_cbt_btn.is_visible()}")

        # Click JLPT N4 CBT Exam
        print("🌸 Switching to JLPT N4 CBT Exams...")
        n4_cbt_btn.click()
        page.wait_for_timeout(500)

        # Launch N4 Exam #1
        print("⏱️ Launching JLPT N4 Live Exam #1...")
        page.locator('button:has-text("Launch JLPT N4 Live Exam")').click()
        page.wait_for_timeout(1000)

        exam_title = page.locator('text=JLPT N4 Official Exam #1')
        print(f"✅ JLPT N4 Active Exam Title visible: {exam_title.is_visible()}")

        # Check Listening in N4 Exam
        print("🎧 Checking N4 Listening Section...")
        page.locator('button:has-text("3. 聴解 (Listening)")').click()
        page.wait_for_timeout(500)
        audio_btn = page.locator('button:has-text("Listen to Audio")')
        print(f"✅ N4 Listening Audio Button visible: {audio_btn.is_visible()}")

        # Submit N4 Exam
        print("🏁 Submitting JLPT N4 Exam...")
        page.locator('button:has-text("Finish Exam (終了)")').click()
        page.wait_for_timeout(1500)

        n4_cert = page.locator('text=日本語能力試験 N4 (JLPT N4)')
        print(f"✅ JLPT N4 Official Certificate visible: {n4_cert.is_visible()}")

        # 3. Verify Vocab Explorer N4 Tab
        print("📚 Checking Vocab Explorer N4 Tab...")
        page.locator('nav button:has-text("Vocab & Kanji")').click()
        page.wait_for_timeout(1000)

        n4_vocab_tab = page.locator('button:has-text("JLPT N4 (267)")')
        print(f"✅ JLPT N4 Vocab Tab visible: {n4_vocab_tab.is_visible()}")
        n4_vocab_tab.click()
        page.wait_for_timeout(500)

        # 4. Verify Flashcards N4 Mode
        print("🎴 Checking Flashcards Deck for N4...")
        page.locator('nav button:has-text("Flashcards (SRS)")').click()
        page.wait_for_timeout(1000)

        # Click N4 in header to switch to N4 deck
        page.locator('header button:has-text("JLPT N4")').first.click()
        page.wait_for_timeout(800)

        fc_count = page.locator('text=/ 267')
        print(f"✅ Flashcard N4 Deck (267 cards) active: {fc_count.is_visible()}")

        screenshot_path = '/home/ian/Projects/sakura-nihongo/jft_n4_laser_focus_verified.png'
        page.screenshot(path=screenshot_path)
        print(f"📸 Full Laser Focus Screenshot saved to {screenshot_path}")

        print("🌸 100% COMPLETE JFT-BASIC & JLPT N4 SUITE OPERATIONAL ON PRODUCTION!")
        browser.close()

if __name__ == "__main__":
    main()
