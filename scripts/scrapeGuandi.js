import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAIN_URL = 'https://fortune-poems.blogspot.com/2011/03/blog-post_03.html';
const TARGET_FILE = path.join(__dirname, '../src/data/fortuneDatabase.js');

async function scrapeGuandi() {
    try {
        console.log('Fetching main list page...');
        const { data: listHtml } = await axios.get(MAIN_URL);
        const $ = cheerio.load(listHtml);

        const links = [];

        // Find all links that look like fortune links
        // The text usually ends with "雷雨師籤百首-XX"
        $('a').each((i, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href');

            if (href && text.match(/雷雨師籤百首-\d+/)) {
                // Extract index from text
                const match = text.match(/(\d+)$/);
                const index = match ? parseInt(match[1], 10) : 0;

                if (index > 0 && index <= 100) {
                    links.push({
                        url: href,
                        title: `第${index}籤`, // Standardize title base
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
            await fs.writeFile('debug_guandi_list.html', listHtml);
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
                    await fs.writeFile('debug_guandi_detail.html', detailHtml);
                }

                let title = link.title;
                let level = '';
                let poem = '';
                let explain = '';

                const bodyText = $detail('body').text();

                // Extract Title and Level from the page content
                // The page usually has "第 X 籤 XX 大吉"
                // Let's try to find the full title line
                // Regex to find "第 [一二三四五六七八九十]+ 籤" or "第 \d+ 籤"
                // And then the Ganzhi (甲甲) and Level (大吉)

                // Example: "第   一   籤     甲甲   大吉"
                const titleMatch = bodyText.match(/第\s*[一二三四五六七八九十0-9]+\s*籤\s+([甲乙丙丁戊己庚辛壬癸]{2})\s+(.+?)\s/);
                if (titleMatch) {
                    // title = `第${link.index}籤 ${titleMatch[1]}`; // Keep it simple or include Ganzhi?
                    // The user wants "籤號、吉凶、籤詩原文、聖意"
                    // Existing data has "title": "第一籤【甲甲】", "level": "大吉"
                    // Let's try to match that format
                    title = `第${link.index}籤【${titleMatch[1]}】`;
                    level = titleMatch[2].trim();
                } else {
                    // Fallback: try to find just level
                    const levelMatch = bodyText.match(/(大吉|上吉|中吉|中平|下下|下吉|上籤|中籤|下籤)/);
                    if (levelMatch) {
                        level = levelMatch[1];
                    }
                }

                // Extract Poem
                // The poem is usually 4 lines.
                // We can try to extract from the link text first as it's cleaner
                // "巍巍獨步向雲間。玉殿千官第一班。富貴榮華天付汝。福如東海壽如山。雷雨師籤百首-01"
                const textParts = link.originalText.split('。');
                if (textParts.length >= 1) {
                    let poemText = link.originalText.replace(/雷雨師籤百首-\d+/, '').trim();
                    poem = poemText.replace(/[，,]/g, '\n').replace(/[。.]/g, '\n').trim();
                    // Remove trailing newline if any
                    poem = poem.replace(/\n$/, '');
                    // Ensure 4 lines if possible, or just leave as is
                }

                // Extract Explanation
                // Look for "聖 意" or "解 曰"
                // "聖 意 ... 東 坡 解 ... 碧 仙 註 ..."
                // Let's try to capture text after "聖 意" until "東 坡 解" or "碧 仙 註" or "解 曰"

                let explainMatch = bodyText.match(/聖\s*意\s*([\s\S]*?)(東\s*坡\s*解|碧\s*仙\s*註|解\s*曰|$)/);
                if (explainMatch) {
                    explain = explainMatch[1].trim();
                } else {
                    // Try "解 曰"
                    explainMatch = bodyText.match(/解\s*曰\s*([\s\S]*?)(釋\s*義|聖\s*意|$)/);
                    if (explainMatch) {
                        explain = explainMatch[1].trim();
                    }
                }

                // Clean up explain
                if (explain) {
                    explain = explain.replace(/\n/g, ' ').replace(/\s+/g, ' ');
                }

                scrapedData.push({
                    title: title,
                    level: level,
                    poem: poem,
                    explain: explain
                });

                // Be polite
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`Failed to scrape ${link.url}:`, error.message);
                scrapedData.push({
                    title: link.title,
                    level: '',
                    poem: '',
                    explain: 'Scraping failed'
                });
            }
        }

        console.log('Updating database file...');

        let fileContent = await fs.readFile(TARGET_FILE, 'utf8');

        // Regex to find the guandi block
        const guandiRegex = /(guandi:\s*\{[\s\S]*?data:\s*)\[[\s\S]*?\]/m;

        if (guandiRegex.test(fileContent)) {
            const newDataStr = JSON.stringify(scrapedData, null, 2);
            fileContent = fileContent.replace(guandiRegex, `$1${newDataStr}`);

            await fs.writeFile(TARGET_FILE, fileContent);
            console.log('Database updated successfully!');
        } else {
            console.error('Could not find guandi data block in file.');
        }

    } catch (error) {
        console.error('Scraping failed:', error);
    }
}

scrapeGuandi();
