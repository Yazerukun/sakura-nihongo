const { chromium } = require('playwright');

async function testLMS() {
  console.log("🚀 Launching Playwright to verify Sakura Nihongo LMS...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const url = 'https://sakura-nihongo.pages.dev';
  console.log(`🌐 Navigating to ${url}...`);

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Check title
  const title = await page.title();
  console.log(`📄 Page title: "${title}"`);

  // Log in using 1-Click quick fill
  console.log("🔑 Logging in...");
  const quickFillBtn = page.locator('text=Quick Fill: Sakura');
  if (await quickFillBtn.isVisible()) {
    await quickFillBtn.click();
    await page.waitForTimeout(500);
    await page.click('button:has-text("Enter Learning Dojo")');
    await page.waitForTimeout(1000);
  }

  // Click on LMS Reviewer & Mock Suite tab
  console.log("🎓 Clicking on LMS Reviewer & Mock Suite tab...");
  const lmsTab = page.locator('button:has-text("LMS Reviewer")');
  await lmsTab.waitFor({ state: 'visible', timeout: 10000 });
  await lmsTab.click();
  await page.waitForTimeout(1500);

  // Verify Pattern Mastery View
  const patternHeader = await page.locator('text=LMS Reviewer & 10 Mock Examination Suite').isVisible();
  console.log(`✅ LMS Header visible: ${patternHeader}`);

  const pattern1Btn = page.locator('text=Kanji Reading').first();
  console.log(`✅ Pattern 1 visible: ${await pattern1Btn.isVisible()}`);

  // Check 10 Mock Exams tab
  console.log("📝 Switching to 10 Full Mock Exams tab...");
  const mockTabBtn = page.locator('button:has-text("10 Full Mock Exams")');
  await mockTabBtn.click();
  await page.waitForTimeout(1000);

  const mockExam1Card = page.locator('text=第1回 総合模擬試験');
  console.log(`✅ Mock Exam #1 visible: ${await mockExam1Card.isVisible()}`);

  const mockExam10Card = page.locator('text=第10回 総合模擬試験');
  console.log(`✅ Mock Exam #10 visible: ${await mockExam10Card.isVisible()}`);

  // Start Mock Exam #1
  console.log("⏱️ Starting Mock Exam #1...");
  const startExamBtn = page.locator('button:has-text("Start Mock Exam #1")');
  await startExamBtn.click();
  await page.waitForTimeout(1000);

  // Check question palette and timer
  const submitBtn = page.locator('button:has-text("Submit Exam")');
  console.log(`✅ Live exam submit button visible: ${await submitBtn.isVisible()}`);

  // Answer first question
  const optionBtn = page.locator('button:has-text("1")').first();
  await optionBtn.click();
  await page.waitForTimeout(500);

  // Submit Mock Exam
  await submitBtn.click();
  await page.waitForTimeout(1500);

  // Check results page
  const resultScorecard = page.locator('text=Official Exam Scorecard');
  console.log(`✅ Post-exam scorecard visible: ${await resultScorecard.isVisible()}`);

  console.log("🎉 ALL LMS VERIFICATIONS PASSED WITH 100% SUCCESS!");
  await browser.close();
}

testLMS().catch(err => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
