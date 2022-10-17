import puppeteer from "puppeteer";

export async function getTorrentsListAsArrayFromPuppeteer(search) {
  const browser = await puppeteer.launch({
    headless: 1,
    args: [`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-gpu`, `--disable-dev-shm-usage`, `--disable-setuid-sandbox`, `--no-first-run`, `--no-sandbox`, `--no-zygote`, `--deterministic-fetch`, `--disable-features=IsolateOrigins`, `--disable-site-isolation-trials`,

    ]
  });
  const page = await browser.newPage();

  await page.goto(`https://1337x.to/search/${search}/1/`, {
    waitUntil: `networkidle2`
  });

  let list = await page.evaluate(resultsSelector => {
    const trs = Array.from(document.querySelectorAll(resultsSelector));
    return trs.map(tr => {
      let tds = tr.textContent.split('\n');
      let size = tds[5].replace(/\d+$/, '');
      let result = {
        link: tr.childNodes[1].childNodes[1].href,
        se: tds[2],
        le: tds[3],
        size,
      };

      return result;
    });
  }, 'table.table-list tbody tr');
  await browser.close();
  return list;
}
