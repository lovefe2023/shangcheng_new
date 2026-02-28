
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Navigate to the local dev server
        print("Navigating to http://localhost:5173/...")
        await page.goto("http://localhost:5173/")
        
        # Wait for the page to load
        await page.wait_for_load_state("networkidle")
        
        # Take a screenshot
        await page.screenshot(path="homepage.png")
        print("Screenshot saved as homepage.png")
        
        # Get page title
        title = await page.title()
        print(f"Page Title: {title}")
        
        # Check for key elements
        # Check for navigation bar
        nav = page.locator("nav")
        if await nav.count() > 0:
            print("Navigation bar found.")
        else:
            print("Navigation bar NOT found.")
            
        # Check for product list (assuming there's a grid or list of products)
        # Based on the code analysis, Home.tsx likely renders products
        # We'll look for common product elements like images or prices
        products = page.locator("img")
        count = await products.count()
        print(f"Found {count} images on the page.")
        
        # Check for specific text that should be present
        # Based on Layout.tsx, we expect "首页", "分类", "购物车", "我的" in the nav
        # Also checking for new design elements added in Home.tsx
        expected_texts = [
            "首页", "分类", "购物车", "我的", 
            "全部商品", "新品上市", "热销榜单", "领券中心", 
            "节日特惠"
        ]
        
        for text in expected_texts:
            if await page.get_by_text(text).count() > 0:
                print(f"Found text: {text}")
            else:
                print(f"Text NOT found: {text}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
