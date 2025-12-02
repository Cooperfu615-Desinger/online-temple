import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAIN_URL = 'https://wisdomer2002.pixnet.net/blog/post/1965757';
const TARGET_FILE = path.join(__dirname, '../src/data/fortuneDatabase.js');

async function scrapeGuanyin() {
    try {
        console.log('Fetching main list page...');
        const { data: listHtml } = await axios.get(MAIN_URL);
        const $ = cheerio.load(listHtml);

        const links = [];

        // Find all links that look like fortune links
        // The text usually ends with "觀音靈籤百首-XX"
        $('a').each((i, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href');

            if (href && text.match(/觀音靈籤百首-\d+/)) {
                // Extract index from text
                const match = text.match(/(\d+)$/);
                const index = match ? parseInt(match[1], 10) : 0;

                if (index > 0 && index <= 100) {
                    links.push({
                        url: href,
                        title: `第${index}籤`, // Standardize title
                        originalText: text,
                        index: index
                    });
                }
            }
        });

        // Remove duplicates based on index
        const uniqueLinks = [];
        const seenIndices = new Set();
        for (const link of links) {
            if (!seenIndices.has(link.index)) {
                seenIndices.add(link.index);
                uniqueLinks.push(link);
            }
        }

        // Sort by index
        uniqueLinks.sort((a, b) => a.index - b.index);

        console.log(`Found ${uniqueLinks.length} fortune links.`);

        if (uniqueLinks.length === 0) {
            console.error('No links found. Saving HTML for inspection...');
            await fs.writeFile('debug_guanyin_list.html', listHtml);
            return;
        }

        const scrapedData = [];

        for (let i = 0; i < uniqueLinks.length; i++) {
            const link = uniqueLinks[i];
            console.log(`Scraping ${i + 1}/${uniqueLinks.length}: ${link.title}`);

            try {
                const { data: detailHtml } = await axios.get(link.url);
                const $detail = cheerio.load(detailHtml);

                // Save first page for debugging
                if (i === 0) {
                    await fs.writeFile('debug_guanyin_detail.html', detailHtml);
                }

                let level = '';
                let poem = '';
                let explain = '';

                const bodyText = $detail('body').text();

                // Extract Level (e.g., 上籤, 上上, 中平)
                // Often found near "第一籤" or "觀音靈籤百首"
                // Look for patterns like "上籤" or "上上"
                const levelMatch = bodyText.match(/(上上|上吉|中吉|中平|下下|下吉|上籤|中籤|下籤)/);
                if (levelMatch) {
                    level = levelMatch[1];
                }

                // Extract Poem
                // Look for the poem text. It's usually 4 lines of 7 chars.
                // Or we can look for "籤詩版本一" or "籤詩" followed by the poem.
                // The main page link text actually contains the poem! 
                // "天開地闢結良緣，日吉時良萬事全，若得此籤非小可，人行中正帝王宣。觀音靈籤百首-01"
                // We can extract it from there as a fallback or primary source.

                // Let's try to extract from the link text first as it's cleaner
                const textParts = link.originalText.split('。');
                if (textParts.length >= 1) {
                    // Remove the "觀音靈籤百首-XX" part
                    let poemText = link.originalText.replace(/觀音靈籤百首-\d+/, '').trim();
                    // Replace commas with newlines
                    poem = poemText.replace(/[，,]/g, '\n').replace(/[。.]/g, '');
                }

                // If not found in link text (unlikely given the pattern), try detail page
                if (!poem) {
                    // Try to find 4 lines of 7 chars
                    // ...
                }

                // Extract Explanation
                // Look for "解 曰" or "聖 意"
                // The detail page has "解 曰 ... 聖 意 ..."
                // Let's try to capture text between "解 曰" and "聖 意" or end of line

                // Using regex on the whole body text might be easier due to messy HTML
                // "解 曰" might have spaces
                const explainMatch = bodyText.match(/解\s*曰\s*([\s\S]*?)(聖\s*意|詩\s*文\s*解\s*譯|整體解譯|$)/);
                if (explainMatch) {
                    explain = explainMatch[1].trim();
                } else {
                    // Try "整體解譯"
                    const overallMatch = bodyText.match(/整體解譯\s*([\s\S]*?)(本籤精髓|$)/);
                    if (overallMatch) {
                        explain = overallMatch[1].trim();
                    }
                }

                // Clean up explain
                if (explain) {
                    explain = explain.replace(/\n/g, ' ').replace(/\s+/g, ' ');
                }

                scrapedData.push({
                    title: link.title,
                    level: level,
                    poem: poem,
                    explain: explain
                });

                // Be polite
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`Failed to scrape ${link.url}:`, error.message);
                // Push a placeholder so we keep the index correct? 
                // Or just skip. Better to have partial data than crash.
                scrapedData.push({
                    title: link.title,
                    level: '',
                    poem: '',
                    explain: 'Scraping failed'
                });
            }
        }

        console.log('Updating database file...');

        // Read existing file
        let fileContent = await fs.readFile(TARGET_FILE, 'utf8');

        // Find the guanyin data block
        // We need to replace the `data: [...]` inside `guanyin: { ... }`

        // Regex to find the guanyin block
        const guanyinRegex = /(guanyin:\s*\{[\s\S]*?data:\s*)\[[\s\S]*?\]/m;

        if (guanyinRegex.test(fileContent)) {
            const newDataStr = JSON.stringify(scrapedData, null, 2);
            // We need to insert the new data string, but JSON.stringify produces double quotes for keys.
            // The existing file uses unquoted keys for some, but JSON is fine.
            // However, we want to match the indentation.

            // Let's just replace the array part.
            fileContent = fileContent.replace(guanyinRegex, `$1${newDataStr}`);

            await fs.writeFile(TARGET_FILE, fileContent);
            console.log('Database updated successfully!');
        } else {
            console.error('Could not find guanyin data block in file.');
        }

    } catch (error) {
        console.error('Scraping failed:', error);
    }
}

scrapeGuanyin();
