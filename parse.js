const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Список категорий
const categories = [
  { name: 'Apple', url: 'https://120w.ru/zaryadnoe_ustroystvo/Apple/' },
  { name: 'Acer', url: 'https://120w.ru/zaryadnoe_ustroystvo/Acer/' },
  { name: 'Samsung', url: 'https://120w.ru/zaryadnoe_ustroystvo/Samsung/' },
  { name: 'Compaq', url: 'https://120w.ru/zaryadnoe_ustroystvo/Compaq/' },
  { name: 'Dell', url: 'https://120w.ru/zaryadnoe_ustroystvo/Dell/' },
  { name: 'eMachines', url: 'https://120w.ru/zaryadnoe_ustroystvo/eMachines/' },
  { name: 'Haier', url: 'https://120w.ru/zaryadnoe_ustroystvo/Haier/' },
  { name: 'Lenovo', url: 'https://120w.ru/zaryadnoe_ustroystvo/Lenovo/' },
  { name: 'MSI', url: 'https://120w.ru/zaryadnoe_ustroystvo/MSI/' },
  { name: 'Microsoft', url: 'https://120w.ru/zaryadnoe_ustroystvo/Microsoft/' },
  { name: 'Sony', url: 'https://120w.ru/zaryadnoe_ustroystvo/sony/' },
  { name: 'Toshiba', url: 'https://120w.ru/zaryadnoe_ustroystvo/Toshiba/' }
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const folderPath = path.resolve(__dirname, 'parsed');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  for (const category of categories) {
    const page = await browser.newPage();
    const results = [];
    const maxPages = 5;

    for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
      const url = currentPage === 1 ? category.url : `${category.url}?PAGEN_1=${currentPage}`;
      console.log(`Парсим ${category.name} - Страница ${currentPage}: ${url}`);

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForSelector('.bx_catalog_item_images', { timeout: 10000 });

        const items = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('.bx_catalog_item_images'));
          return elements.map(el => {
            const title = el.getAttribute('title') || '';
            const link = 'https://120w.ru' + (el.getAttribute('href') || '');
            const bg = el.style.backgroundImage || '';
            const image = bg.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || '';
            return {
              title,
              link,
              image: image.startsWith('http') ? image : 'https://120w.ru' + image
            };
          });
        });

        for (const item of items) {
          console.log(`  → Собираем характеристики для: ${item.title}`);

          try {
            const productPage = await browser.newPage();
            await productPage.goto(item.link, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await productPage.waitForSelector('#propTableFull', { timeout: 10000 });

            // 🔥 ВСТАВЛЯЕМ ТУТ ПАРСИНГ СПЕЦИФИКАЦИЙ + ЦЕНЫ
            const { specs, price } = await productPage.evaluate(() => {
              const specTable = document.querySelector('#propTableFull');
              const specs = {};

              if (specTable) {
                const rows = specTable.querySelectorAll('tr');
                rows.forEach(row => {
                  const keyCell = row.querySelector('td:nth-child(1)');
                  const valueCell = row.querySelector('td:nth-child(2)');
                  if (keyCell && valueCell) {
                    const key = keyCell.textContent.trim().replace(/\s+/g, ' ');
                    const value = valueCell.textContent.trim();
                    specs[key] = value;
                  }
                });
              }

              const priceElement = document.querySelector('.item_current_price');
              const price = priceElement ? priceElement.textContent.trim() : null;

              return { specs, price };
            });

            item.specs = specs;
            item.price = price; // <-- сохраняем цену в item
            await productPage.close();
          } catch (err) {
            console.error(`  ⚠️ Ошибка при сборе характеристик для ${item.title}: ${err.message}`);
          }
        }

        results.push(...items);
      } catch (error) {
        console.error(`Ошибка при парсинге ${category.name}, стр ${currentPage}: ${error.message}`);
      }
    }

    await page.close();

    const filePath = path.join(folderPath, `${category.name.toLowerCase()}_chargers.json`);
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`✅ Собрано ${results.length} товаров из ${category.name}. Сохранено в ${filePath}`);
  }

  await browser.close();
})();
