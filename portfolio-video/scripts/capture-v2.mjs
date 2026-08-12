import { chromium } from "../../node_modules/playwright-core/index.mjs";
import { mkdir, readFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const videoRoot = path.resolve(here, "..");
const projectRoot = path.resolve(videoRoot, "..");
const capturesDir = path.join(videoRoot, "captures", "v2");
const tempDir = path.join(capturesDir, ".tmp");
const baseURL = process.env.MAHVARA_BASE_URL ?? "http://localhost:3010";
const executablePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const envText = await readFile(path.join(projectRoot, ".env"), "utf8");
const envValue = (key) => {
  const line = envText.split(/\r?\n/).find((entry) => entry.trim().startsWith(`${key}=`));
  if (!line) throw new Error(`Missing ${key}`);
  return line.slice(line.indexOf("=") + 1).trim().replace(/^['"]|['"]$/g, "");
};
const credentials = {
  customer: { email: envValue("DEMO_CUSTOMER_EMAIL"), password: envValue("DEMO_CUSTOMER_PASSWORD") },
  admin: { email: envValue("DEMO_ADMIN_EMAIL"), password: envValue("DEMO_ADMIN_PASSWORD") },
};

await rm(tempDir, { recursive: true, force: true });
await mkdir(tempDir, { recursive: true });
await mkdir(capturesDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath, args: ["--hide-scrollbars"] });
const failures = [];

async function ensureCursor(page, visible = true) {
  await page.evaluate((show) => {
    let cursor = document.querySelector("#mahvara-v2-cursor");
    if (!cursor) {
      cursor = document.createElement("div");
      cursor.id = "mahvara-v2-cursor";
      cursor.innerHTML = "<span></span>";
      document.body.append(cursor);
    }
    let style = document.querySelector("#mahvara-v2-cursor-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "mahvara-v2-cursor-style";
      style.textContent = `
        * { cursor: none !important; }
        #mahvara-v2-cursor { position:fixed; left:72%; top:66%; z-index:2147483647; width:23px; height:23px; pointer-events:none; transform:translate(-4px,-4px); filter:drop-shadow(0 4px 6px rgba(30,14,18,.28)); }
        #mahvara-v2-cursor::before { content:''; position:absolute; inset:0; background:#fff; clip-path:polygon(0 0,0 92%,25% 70%,42% 100%,56% 92%,39% 63%,70% 61%); }
        #mahvara-v2-cursor::after { content:''; position:absolute; inset:-1px; z-index:-1; background:#25191c; clip-path:polygon(0 0,0 92%,25% 70%,42% 100%,56% 92%,39% 63%,70% 61%); }
        #mahvara-v2-cursor span { position:absolute; width:13px; height:13px; left:2px; top:2px; border:2px solid #7a203b; border-radius:50%; opacity:0; }
        #mahvara-v2-cursor.pulse span { animation:v2-click .56s cubic-bezier(.2,.8,.2,1); }
        @keyframes v2-click { 0%{opacity:.85;transform:scale(.35)} 100%{opacity:0;transform:scale(3.7)} }
        .mahvara-v2-tap { position:fixed; z-index:2147483646; width:12px; height:12px; margin:-6px; border:2px solid #7a203b; border-radius:50%; pointer-events:none; animation:v2-tap .55s ease-out forwards; }
        @keyframes v2-tap { from{opacity:.85;transform:scale(.4)} to{opacity:0;transform:scale(4.2)} }
      `;
      document.head.append(style);
    }
    cursor.style.display = show ? "block" : "none";
  }, visible);
}

async function visibleLocator(page, selector) {
  const candidates = page.locator(selector);
  const count = await candidates.count();
  for (let index = 0; index < count; index += 1) {
    const candidate = candidates.nth(index);
    if (await candidate.isVisible()) return candidate;
  }
  throw new Error(`No visible locator for ${selector}`);
}

async function moveCursor(page, target, options = {}) {
  const locator = typeof target === "string" ? await visibleLocator(page, target) : target;
  await locator.waitFor({ state: "visible", timeout: 15_000 });
  const box = await locator.boundingBox();
  if (!box) throw new Error(`No bounding box for ${target}`);
  const x = box.x + box.width * (options.x ?? 0.5);
  const y = box.y + box.height * (options.y ?? 0.5);
  await ensureCursor(page);
  await page.evaluate(async ({ x, y, duration, curve }) => {
    const cursor = document.querySelector("#mahvara-v2-cursor");
    if (!cursor) return;
    const rect = cursor.getBoundingClientRect();
    const x0 = rect.left + 4;
    const y0 = rect.top + 4;
    const dx = x - x0;
    const dy = y - y0;
    const length = Math.max(1, Math.hypot(dx, dy));
    const px = -dy / length;
    const py = dx / length;
    const bend = Math.min(126, length * 0.2) * curve;
    const x1 = x0 + dx * 0.3 + px * bend;
    const y1 = y0 + dy * 0.3 + py * bend;
    const x2 = x0 + dx * 0.72 + px * bend * 0.48;
    const y2 = y0 + dy * 0.72 + py * bend * 0.48;
    const start = performance.now();
    await new Promise((resolve) => {
      const tick = (now) => {
        const raw = Math.min(1, (now - start) / duration);
        const p = raw < 0.5 ? 4 * raw ** 3 : 1 - ((-2 * raw + 2) ** 3) / 2;
        const q = 1 - p;
        const cx = q ** 3 * x0 + 3 * q ** 2 * p * x1 + 3 * q * p ** 2 * x2 + p ** 3 * x;
        const cy = q ** 3 * y0 + 3 * q ** 2 * p * y1 + 3 * q * p ** 2 * y2 + p ** 3 * y;
        cursor.style.left = `${cx}px`;
        cursor.style.top = `${cy}px`;
        if (raw < 1) requestAnimationFrame(tick); else resolve();
      };
      requestAnimationFrame(tick);
    });
  }, { x, y, duration: options.duration ?? 680, curve: options.curve ?? (x > y ? 1 : -1) });
  await page.mouse.move(x, y);
  await locator.hover({ force: true });
  await page.waitForTimeout(options.pause ?? 300);
  return locator;
}

async function hoverTarget(page, target, options = {}) {
  const locator = await moveCursor(page, target, options);
  await page.waitForTimeout(options.hover ?? 650);
  return locator;
}

async function clickTarget(page, target, options = {}) {
  const locator = await moveCursor(page, target, options);
  await page.evaluate(() => {
    const cursor = document.querySelector("#mahvara-v2-cursor");
    cursor?.classList.remove("pulse");
    void cursor?.getBoundingClientRect();
    cursor?.classList.add("pulse");
  });
  await page.waitForTimeout(110);
  await locator.click();
  await page.waitForTimeout(options.after ?? 620);
}

async function tapTarget(page, target, options = {}) {
  const locator = typeof target === "string" ? await visibleLocator(page, target) : target;
  const box = await locator.boundingBox();
  if (!box) throw new Error(`No tap box for ${target}`);
  const x = box.x + box.width * (options.x ?? 0.5);
  const y = box.y + box.height * (options.y ?? 0.5);
  await page.evaluate(({ x, y }) => {
    const dot = document.createElement("i");
    dot.className = "mahvara-v2-tap";
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    document.body.append(dot);
    setTimeout(() => dot.remove(), 700);
  }, { x, y });
  await page.waitForTimeout(90);
  await locator.tap({ force: true }).catch(() => locator.click({ force: true }));
  await page.waitForTimeout(options.after ?? 620);
}

async function smoothScroll(page, targetY, duration = 1300) {
  await page.evaluate(async ({ targetY, duration }) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const start = performance.now();
    await new Promise((resolve) => {
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = p < 0.5 ? 4 * p ** 3 : 1 - ((-2 * p + 2) ** 3) / 2;
        window.scrollTo(0, startY + distance * eased);
        if (p < 1) requestAnimationFrame(tick); else resolve();
      };
      requestAnimationFrame(tick);
    });
  }, { targetY, duration });
}

async function goto(page, route, cursor = true) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle", timeout: 45_000 });
  if (response && response.status() >= 400) throw new Error(`${route} returned ${response.status()}`);
  await ensureCursor(page, cursor);
}

async function loginSilently(page, role) {
  const result = await page.evaluate(async (payload) => {
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return { ok: response.ok, status: response.status };
  }, credentials[role]);
  if (!result.ok) throw new Error(`Demo ${role} login failed (${result.status})`);
}

async function record(name, action, options = {}) {
  const width = options.width ?? 1920;
  const height = options.height ?? 1080;
  const context = await browser.newContext({
    viewport: { width, height }, locale: "fa-IR", colorScheme: "light", reducedMotion: "no-preference",
    recordVideo: { dir: tempDir, size: { width, height } },
    ...(options.mobile ? { isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : {}),
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("favicon")) failures.push(`${name}: ${message.text()}`);
  });
  const video = page.video();
  try {
    await action(page, context);
    await page.waitForTimeout(700);
  } finally {
    await context.close();
  }
  const sourcePath = await video.path();
  const outputPath = path.join(capturesDir, `${name}.webm`);
  await rm(outputPath, { force: true });
  await rename(sourcePath, outputPath);
  console.log(`Captured v2/${name}.webm`);
}

try {
  await record("discovery", async (page) => {
    await goto(page, "/");
    await page.waitForTimeout(700);
    await smoothScroll(page, 610, 1250);
    await hoverTarget(page, 'a[href="/shop?category=skincare"]', { duration: 760, hover: 760, curve: 1 });
    await smoothScroll(page, 1170, 1120);
    await hoverTarget(page, 'a[href="/product/hydra-serum"]', { duration: 720, hover: 900, curve: -1 });
    await smoothScroll(page, 0, 1250);
    await page.waitForTimeout(350);
    await clickTarget(page, 'header button[aria-label="جست‌وجوی محصول"]', { duration: 720, after: 520, curve: 1 });
    const search = await visibleLocator(page, 'input[aria-label="عبارت جست‌وجو"]');
    await search.pressSequentially("سرم آبرسان", { delay: 82 });
    await page.waitForTimeout(900);
    await hoverTarget(page, 'div[role="dialog"] a[href="/product/hydra-serum"]', { duration: 660, hover: 520, curve: -1 });
    await clickTarget(page, 'div[role="dialog"] a[href="/product/hydra-serum"]', { duration: 260, after: 1000, curve: 1 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page);
    await page.waitForTimeout(850);
  });

  await record("product-cart", async (page) => {
    await goto(page, "/");
    await loginSilently(page, "customer");
    await goto(page, "/product/hydra-serum");
    await page.waitForTimeout(700);
    await clickTarget(page, 'button[aria-label="نمایش تصویر 2"]', { after: 650, curve: 1 });
    await hoverTarget(page, 'button:has-text("ذخیره در علاقه‌مندی")', { duration: 620, hover: 420, curve: -1 });
    await clickTarget(page, 'button:has-text("ذخیره در علاقه‌مندی")', { duration: 260, after: 800, curve: 1 });
    await clickTarget(page, 'button[aria-label="افزایش تعداد"]', { after: 330, curve: -1 });
    await clickTarget(page, 'button[aria-label="افزایش تعداد"]', { after: 420, curve: 1 });
    await hoverTarget(page, 'button:has-text("افزودن به سبد خرید")', { duration: 680, hover: 500, curve: -1 });
    await clickTarget(page, 'button:has-text("افزودن به سبد خرید")', { duration: 250, after: 1050, curve: 1 });
    await clickTarget(page, 'header a[href="/cart"]', { duration: 760, after: 950, curve: -1 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page);
    await page.waitForTimeout(650);
    await hoverTarget(page, 'article:has-text("سرم آبرسان")', { duration: 670, hover: 500, curve: 1 });
    await clickTarget(page, 'button[aria-label="کاهش تعداد"]', { duration: 540, after: 650, curve: -1 });
    await page.waitForTimeout(750);
  });

  await record("checkout-flow", async (page) => {
    await goto(page, "/");
    await loginSilently(page, "customer");
    await page.evaluate(() => localStorage.setItem("mahvara-cart-v1", JSON.stringify([
      { productId: "prd_001", quantity: 2 }, { productId: "prd_002", quantity: 1 },
    ])));
    await goto(page, "/cart");
    await page.waitForTimeout(750);
    await hoverTarget(page, 'aside:has-text("خلاصه سفارش")', { duration: 680, hover: 480, curve: 1 });
    const coupon = await moveCursor(page, "#coupon", { duration: 650, curve: -1 });
    await coupon.click();
    await coupon.pressSequentially("ROUTINE15", { delay: 68 });
    await clickTarget(page, 'button:has-text("اعمال")', { after: 700, curve: 1 });
    await clickTarget(page, 'a:has-text("ادامه به پرداخت امن")', { duration: 680, after: 950, curve: -1 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page);
    await page.locator("#firstName").fill("سارا");
    await page.locator("#lastName").fill("آزمایشی");
    await page.locator("#phone").fill("09120000002");
    await page.locator("#postalCode").fill("1234567890");
    await page.locator("#province").selectOption({ label: "تهران" });
    await page.locator("#city").fill("تهران");
    const address = page.locator("#address");
    await moveCursor(page, address, { duration: 620, curve: 1 });
    await address.click();
    await address.pressSequentially("خیابان نمونه، کوچه آزمایش، پلاک ۱۲", { delay: 28 });
    await page.waitForTimeout(350);
    for (const heading of ["روش ارسال", "بازبینی سفارش", "پرداخت امن"]) {
      await clickTarget(page, 'button:has-text("ادامه")', { after: 560, curve: -1 });
      if (new URL(page.url()).pathname === "/payment/mock") break;
      await page.locator(`h2:has-text("${heading}")`).waitFor({ state: "visible", timeout: 5_000 });
    }
    if (new URL(page.url()).pathname !== "/payment/mock") {
      await clickTarget(page, 'form button:not([type])', { after: 1050, curve: 1 });
      await page.waitForLoadState("networkidle");
    }
    await ensureCursor(page);
    await page.waitForTimeout(650);
    await hoverTarget(page, 'button:has-text("شبیه‌سازی پرداخت موفق")', { duration: 650, hover: 520, curve: -1 });
    await clickTarget(page, 'button:has-text("شبیه‌سازی پرداخت موفق")', { duration: 240, after: 1150, curve: 1 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page);
    await page.waitForTimeout(1000);
  });

  await record("account-order", async (page) => {
    await goto(page, "/");
    await loginSilently(page, "customer");
    await goto(page, "/account");
    await page.waitForTimeout(750);
    await clickTarget(page, 'a[href="/account/orders"]', { duration: 680, after: 900, curve: 1 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page);
    const order = await visibleLocator(page, 'main a[href^="/account/orders/"]');
    await hoverTarget(page, order, { duration: 620, hover: 750, curve: -1 });
    await clickTarget(page, order, { duration: 240, after: 950, curve: 1 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page);
    await page.waitForTimeout(850);
    await hoverTarget(page, 'section:has-text("خلاصه مالی")', { duration: 680, hover: 650, curve: -1 });
    await clickTarget(page, 'a[href="/account/wishlist"]', { duration: 720, after: 900, curve: 1 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page);
    await page.waitForTimeout(850);
  });

  await record("admin-order", async (page) => {
    await goto(page, "/");
    await loginSilently(page, "admin");
    await goto(page, "/admin");
    await page.waitForTimeout(800);
    await hoverTarget(page, 'section:has-text("سفارش‌های اخیر")', { duration: 720, hover: 720, curve: -1 });
    await clickTarget(page, 'a[href="/admin/orders"]', { duration: 680, after: 900, curve: 1 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page);
    const firstRow = page.locator("tbody tr").first();
    await hoverTarget(page, firstRow, { duration: 680, hover: 700, curve: -1 });
    const status = firstRow.locator("select");
    await moveCursor(page, status, { duration: 520, curve: 1 });
    await status.selectOption("PROCESSING");
    await page.waitForTimeout(400);
    await clickTarget(page, firstRow.locator('button:has-text("ثبت")'), { duration: 420, after: 850, curve: -1 });
    await clickTarget(page, 'a[href="/admin/products"]', { duration: 680, after: 900, curve: 1 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page);
    await smoothScroll(page, 390, 1050);
    await page.waitForTimeout(900);
  });

  await record("mobile-flow", async (page) => {
    await goto(page, "/", false);
    await page.waitForTimeout(650);
    await tapTarget(page, 'button[aria-label="باز کردن منو"]', { after: 650 });
    await tapTarget(page, 'aside a[href="/shop"]', { after: 850 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page, false);
    await smoothScroll(page, 520, 1100);
    await page.waitForTimeout(500);
    await tapTarget(page, 'a[href="/product/hydra-serum"]', { after: 900 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page, false);
    await page.waitForTimeout(650);
    await tapTarget(page, 'button[aria-label="نمایش تصویر 2"]', { after: 550 });
    const addButtons = page.locator('button:has-text("افزودن به سبد")');
    let addButton;
    for (let index = 0; index < await addButtons.count(); index += 1) {
      if (await addButtons.nth(index).isVisible()) { addButton = addButtons.nth(index); break; }
    }
    if (!addButton) throw new Error("Mobile add-to-cart button not visible");
    await tapTarget(page, addButton, { after: 800 });
    await tapTarget(page, 'header a[href="/cart"]', { after: 900 });
    await page.waitForLoadState("networkidle");
    await ensureCursor(page, false);
    await page.waitForTimeout(1000);
  }, { width: 390, height: 844, mobile: true });

  const posterContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "fa-IR", colorScheme: "light" });
  const posterPage = await posterContext.newPage();
  await posterPage.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await posterPage.screenshot({ path: path.join(capturesDir, "poster-home.png") });
  await posterPage.goto(`${baseURL}/product/hydra-serum`, { waitUntil: "networkidle" });
  await posterPage.screenshot({ path: path.join(capturesDir, "poster-product.png") });
  await posterContext.close();
  console.log("Captured V2 poster stills.");
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
await rm(tempDir, { recursive: true, force: true });
console.log("All V2 captures completed without browser console errors.");
