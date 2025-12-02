import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.8327777.org.tw/';
const LIST_URL = 'https://www.8327777.org.tw/?act=jieqianyuandi&cmd=list';
const TARGET_FILE = path.join(__dirname, '../src/data/fortuneDatabase.js');

async function scrapeMazu() {
    try {
        console.log('Fetching list page...');
        const { data: listHtml } = await axios.get(LIST_URL);
        const $ = cheerio.load(listHtml);

        const links = [];

        // The JS code suggests: .jieqianyuandi_content li a
        $('.jieqianyuandi_content li a').each((i, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            // console.log(`Link: ${text} -> ${href}`); 
            if (href) {
                links.push({
                    url: href.startsWith('http') ? href : BASE_URL + href,
                    title: text
                });
            }
        });

        // Remove duplicates if any
        const uniqueLinks = [...new Map(links.map(item => [item.url, item])).values()];

        console.log(`Found ${uniqueLinks.length} fortune links.`);

        if (uniqueLinks.length === 0) {
            console.error('No links found. Saving HTML for inspection...');
            await fs.writeFile('debug_list_ajax.html', listHtml);
            return;
        }

        const scrapedData = [];

        for (const [index, link] of uniqueLinks.entries()) {
            console.log(`Scraping ${index + 1}/${uniqueLinks.length}: ${link.title}`);
            try {
                const { data: detailHtml } = await axios.get(link.url);
                const $detail = cheerio.load(detailHtml);

                if (index === 0) {
                    await fs.writeFile('debug_detail.html', detailHtml);
                }

                let title = '';
                let poem = '';
                let explain = '';

                // Title
                title = $detail('h2.grid-item-title').first().text().trim();
                if (!title) title = link.title;

                // Poem
                // The poem is in .grid-item-poems, often in span.block
                const poemEl = $detail('.grid-item-poems');
                if (poemEl.length) {
                    // Get text from spans, join with newline
                    poem = poemEl.find('.block').map((i, el) => $(el).text().trim()).get().join('\n');
                    // If no blocks, just get text
                    if (!poem) poem = poemEl.text().trim();
                }

                // Explain
                // The explanation is in .grid-item-explain .grid-item-text
                const explainEl = $detail('.grid-item-explain .grid-item-text');
                if (explainEl.length) {
                    explain = explainEl.text().trim();
                } else {
                    // Fallback
                    explain = $detail('.grid-item-text').first().text().trim();
                }

                // Clean up
                if (explain) explain = explain.replace(/解曰[：:]?/, '').trim();

                // Ensure poem has newlines if it was comma separated and not in blocks
                if (poem && !poem.includes('\n')) {
                    poem = poem.replace(/[，,]/g, '\n').replace(/[。.]/g, '');
                }

                // console.log(`Scraped ${link.title}: Poem len=${poem.length}, Explain len=${explain.length}`);
                scrapedData.push({
                    title: title || link.title,
                    level: '', // The site might not have level explicitly, or I need to find it.
                    poem: poem,
                    explain: explain
                });

                // Be nice to the server
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (err) {
                console.error(`Error scraping ${link.url}:`, err.message);
            }
        }

        // Update the file
        console.log('Updating database file...');
        const fileContent = await fs.readFile(TARGET_FILE, 'utf-8');

        // We need to replace the `mazu: { ... data: [...] }` part.
        // I'll use regex to find the mazu section and replace the data array.

        // This is a bit tricky with regex on nested objects.
        // But the file structure is known.
        // `mazu: { ... data: [ ... ] }`

        // I'll construct the new data string.
        const newDataString = JSON.stringify(scrapedData, null, 12).slice(1, -1); // Remove outer brackets to insert into the array brackets? 
        // No, let's just replace the whole `data: [...]` block inside `mazu: { ... }`.

        // Let's try to find the `mazu` object start.
        const mazuStart = fileContent.indexOf('mazu: {');
        if (mazuStart === -1) throw new Error('Could not find mazu section');

        // Find the `data: [` inside mazu section.
        const dataStart = fileContent.indexOf('data: [', mazuStart);
        if (dataStart === -1) throw new Error('Could not find data section in mazu');

        // Find the closing `]` for data.
        // We need to balance brackets.
        let bracketCount = 1;
        let dataEnd = dataStart + 7;
        while (bracketCount > 0 && dataEnd < fileContent.length) {
            if (fileContent[dataEnd] === '[') bracketCount++;
            else if (fileContent[dataEnd] === ']') bracketCount--;
            dataEnd++;
        }

        const newContent = fileContent.slice(0, dataStart) +
            `data: ${JSON.stringify(scrapedData, null, 12)}` +
            fileContent.slice(dataEnd);

        await fs.writeFile(TARGET_FILE, newContent);
        console.log('Database updated successfully!');

    } catch (error) {
        console.error('Scraping failed:', error);
    }
}

scrapeMazu();
