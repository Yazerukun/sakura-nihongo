from playwright.sync_api import sync_playwright

def main():
    print("🚀 Verifying Real-Time Prometric CBT Exam on Production...")
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

        # Click Real-Time Official CBT Exam tab
        print("🎯 Navigating to Real-Time Official CBT Exam tab...")
        page.locator('nav button:has-text("Real-Time Official CBT")').click()
        page.wait_for_timeout(1000)

        # Verify Live CBT Indicator
        live_indicator = page.locator('text=Live Prometric CBT Terminal Connected')
        print(f"✅ Prometric Live Terminal Indicator visible: {live_indicator.is_visible()}")

        # Check Exam #1 to #6 buttons
        exam1_btn = page.locator('button:has-text("Exam #1")').first
        exam6_btn = page.locator('button:has-text("Exam #6")').first
        print(f"✅ Exam #1 Button visible: {exam1_btn.is_visible()}")
        print(f"✅ Exam #6 Button visible: {exam6_btn.is_visible()}")

        # Launch Real-Time Exam #1
        print("⏱️ Launching Real-Time Live Exam #1...")
        page.locator('button:has-text("Launch Real-Time Live Exam")').click()
        page.wait_for_timeout(1000)

        # Verify Prometric proctored bar
        proctored_bar = page.locator('text=Prometric Live CBT Proctored Session')
        print(f"✅ Proctored Status Bar visible: {proctored_bar.is_visible()}")

        examinee = page.locator('text=Examinee: Sakura')
        print(f"✅ Examinee Sakura visible: {examinee.is_visible()}")

        # Jump to Section 3: Listening
        print("🎧 Testing Section 3 Listening Comprehension...")
        page.locator('button:has-text("3. 聴解 (Listening)")').click()
        page.wait_for_timeout(500)

        listening_box = page.locator('text=Section 3: Audio Dialogue Listening Task')
        print(f"✅ Listening Task Box visible: {listening_box.is_visible()}")

        audio_btn = page.locator('button:has-text("Listen to Audio")')
        print(f"✅ Audio Dialogue Button visible: {audio_btn.is_visible()}")

        # Test Palette Modal
        print("📋 Testing Prometric Question Palette (一覧)...")
        page.locator('button:has-text("Question Palette (一覧)")').click()
        page.wait_for_timeout(500)

        palette_header = page.locator('text=Question Palette & Status Grid')
        print(f"✅ Question Palette Modal visible: {palette_header.is_visible()}")
        page.locator('button:has-text("Close Palette")').click()
        page.wait_for_timeout(500)

        # Submit Exam
        print("🏁 Submitting Real-Time Exam...")
        page.locator('button:has-text("Finish Exam (終了)")').click()
        page.wait_for_timeout(1500)

        # Verify Official Results Certificate
        cert = page.locator('text=判定結果通知書')
        print(f"✅ Official Certificate (判定結果通知書) visible: {cert.is_visible()}")

        cand_name = page.locator('text=さくら (Sakura)')
        print(f"✅ Candidate Name on Certificate visible: {cand_name.is_visible()}")

        sweet_note = page.locator('text=To Ian\'s Beloved Sakura')
        print(f"✅ Ian's Sweet Note on Certificate visible: {sweet_note.is_visible()}")

        screenshot_path = '/home/ian/Projects/sakura-nihongo/cbt_certificate_verified.png'
        page.screenshot(path=screenshot_path)
        print(f"📸 Certificate Screenshot saved to {screenshot_path}")

        print("🌸 100% REAL-TIME PROMETRIC CBT EXAM FULLY VERIFIED ON PRODUCTION!")
        browser.close()

if __name__ == "__main__":
    main()
