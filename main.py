import asyncio
from datetime import datetime, timedelta
from pathlib import Path

from tqdm import tqdm
import pandas as pd
from playwright.async_api import async_playwright

HEADLESS = True  # False: 打开浏览器（调试时建议使用） / True: 浏览器在后台运行
POSITION_LIST_URL = "https://zhaopin.comac.cc/zp/ct/out/position"

# 用于获取岗位链接的js脚本，返回一个岗位链接列表: List[str]
spider_js = Path("./spider.js").read_text(encoding="utf-8")

# 在岗位详情页，解析岗位信息的js脚本，返回一个字典: Dict[str, str]
parse_js = Path("./parse.js").read_text(encoding="utf-8")


async def main():
    async with async_playwright() as p:
        # 1. 打开浏览器、新建页面
        browser = await p.chromium.launch(headless=HEADLESS, slow_mo=200)
        page = await browser.new_page()

        # 2. 前往招聘岗位页，获取这些岗位对应的链接
        await page.goto(POSITION_LIST_URL)
        position_urls = await page.evaluate(spider_js)

        # 3. 逐个访问岗位详情页，获取各个岗位的详细信息
        info_ls = []
        for position_url in tqdm(position_urls):
            await page.goto(position_url)
            info = await page.evaluate(parse_js)
            info_ls.append({**info, "岗位链接": position_url})

    # 4. 将获取到的信息保存到Excel文件
    now = (datetime.utcnow() + timedelta(hours=8)).strftime("%Y%m%d")

    output_path = Path(f"./outputs/comac-recruit-info-{now}.xlsx")
    output_path.parent.mkdir(exist_ok=True, parents=True)
    pd.DataFrame(info_ls).to_excel(output_path, index=False)


if __name__ == '__main__':
    asyncio.run(main())
