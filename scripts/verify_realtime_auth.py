import sys
import time
from playwright.sync_api import sync_playwright

def run_auth_verification():
    print("🚀 Starting Real-Time Authentication & Account Creation Verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        # Listen to console
        page.on("console", lambda msg: print(f"  [Browser Console] {msg.type}: {msg.text}") if msg.type in ["error", "warning"] else None)

        target_url = sys.argv[1] if len(sys.argv) > 1 else "https://sakura-nihongo.pages.dev"
        print(f"🌐 Navigating to {target_url}...")
        page.goto(target_url)
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        # 1. Verify modal is open and fields are BLANK (no sensitive data leak)
        print("🔍 Checking Login Modal initial state (should be blank, no leaked credentials)...")
        username_input = page.locator('input[placeholder="Enter your username"]')
        password_input = page.locator('input[placeholder="Enter your password"]')
        
        assert username_input.is_visible(), "Username input must be visible"
        assert password_input.is_visible(), "Password input must be visible"
        assert username_input.input_value() == "", f"Username must start empty, got: {username_input.input_value()}"
        assert password_input.input_value() == "", f"Password must start empty, got: {password_input.input_value()}"
        print("  ✅ Login inputs are clean and blank (no sensitive credentials exposed)!")

        # Verify no quick demo buttons exist
        quick_demo = page.locator('text=Quick 1-Click Access')
        assert quick_demo.count() == 0, "Quick demo login buttons must NOT be present!"
        print("  ✅ Quick demo buttons completely removed!")

        # 2. Test Invalid Credentials
        print("🧪 Testing invalid login credentials...")
        username_input.fill("unknown_user")
        password_input.fill("wrongpass")
        page.click('button:has-text("Enter Study Portal")')
        time.sleep(0.5)
        error_msg = page.locator('text=Incorrect username or password')
        assert error_msg.is_visible(), "Error message should be shown for wrong credentials"
        print("  ✅ Invalid credentials correctly rejected!")

        # 3. Test Mariel's Login (username: mariel, pass: 111)
        print("🌸 Testing Mariel's login (username: mariel, pass: 111)...")
        username_input.fill("mariel")
        password_input.fill("111")
        page.click('button:has-text("Enter Study Portal")')
        page.wait_for_selector('header', state="visible", timeout=5000)
        time.sleep(1)

        # Check profile display name in Header
        display_name = page.locator('header').locator('text=Mariel')
        assert display_name.count() > 0, "Mariel display name should be visible in header"
        print("  ✅ Mariel logged in successfully with pass: 111!")

        # Start the CBT exam to verify the live examinee bar
        page.click('button:has-text("Launch")')
        time.sleep(1)

        # Verify CBT Exam Simulator reflects Mariel
        examinee_bar = page.locator('text=Examinee: Mariel (マリエル)')
        assert examinee_bar.is_visible(), "Examinee bar must show Examinee: Mariel (マリエル)"
        print("  ✅ CBT Exam Simulator shows Examinee: Mariel (マリエル)!")

        # 4. Test Logout
        print("🚪 Testing Logout...")
        page.click('button[title="Log out"]')
        time.sleep(1)

        # Verify back to login modal
        assert page.locator('input[placeholder="Enter your username"]').is_visible(), "Should return to Login Modal after logout"
        print("  ✅ Logged out cleanly!")

        # 5. Test Real-Time Account Creation (Sign Up / Register)
        print("✨ Testing Real-Time Account Creation (Create Account)...")
        page.click('button:has-text("Create Account")')
        time.sleep(0.5)

        # Fill registration form
        page.fill('input[placeholder*="Maria, Kenji"]', "Kenji Tanaka")
        page.fill('input[placeholder*="maria2026"]', "kenji_jp")
        page.fill('input[placeholder*="secure password"]', "pass456")
        page.select_option('select', 'N4')

        # Submit registration
        page.click('button:has-text("Create Account & Start Learning")')
        page.wait_for_selector('header', state="visible", timeout=5000)
        time.sleep(1)

        # Verify new user profile is loaded
        kenji_profile = page.locator('header').locator('text=Kenji')
        assert kenji_profile.count() > 0, "New registered user Kenji must be logged in"
        print("  ✅ Real-time account 'kenji_jp' created and automatically logged in!")

        # 6. Test Logging back in with the freshly registered account
        print("🔄 Testing logging out and logging back in with newly created account...")
        page.click('button[title="Log out"]')
        time.sleep(1)

        page.fill('input[placeholder="Enter your username"]', "kenji_jp")
        page.fill('input[placeholder="Enter your password"]', "pass456")
        page.click('button:has-text("Enter Study Portal")')
        page.wait_for_selector('header', state="visible", timeout=5000)
        time.sleep(1)

        assert page.locator('header').locator('text=Kenji').count() > 0, "Should be logged in as Kenji"
        print("  ✅ Successfully logged back in using newly created account!")

        # Screenshot proof
        page.screenshot(path="realtime_auth_verified.png")
        print("📸 Saved verification screenshot to realtime_auth_verified.png")
        print("🎉 ALL REAL-TIME AUTHENTICATION & REGISTRATION TESTS PASSED 100%!")

if __name__ == "__main__":
    run_auth_verification()
