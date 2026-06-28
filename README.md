# 133x-finder

Command-line tool that searches 1337x.to for torrents and ranks results by a health score, then prints the top N as a table.

## What it does

Given a search term, it:

1. Opens a headless Chromium browser via Puppeteer and scrapes the 1337x search results page
2. Parses each row for link, seeders, leechers, and file size
3. Converts sizes to bytes for uniform comparison
4. Computes a health weight per torrent using seeders, leechers, and size relative to the 33rd-percentile, 95th-percentile, and mean values across all results
5. Filters out 720p results
6. Sorts by weight descending and returns the top N
7. Prints the results as a Markdown table (link, size, seeders)

## Requirements

- Node.js 16+ (ESM)
- Yarn or npm
- Chromium/Chrome reachable by Puppeteer (downloads automatically on first install)

## Installation

```sh
git clone https://github.com/nadimtuhin/133x-finder.git
cd 133x-finder
yarn install
```

## Usage

```sh
node index.js <search term> [n]
```

`n` is the number of results to show (default: 3).

Examples:

```sh
node index.js moneyball
node index.js moneyball 5
node index.js "endgame 2019" 6
```

Sample output:

```
| link                              | size     | se  |
|-----------------------------------|----------|-----|
| https://1337x.to/torrent/...      | 1.92 GB  | 312 |
| https://1337x.to/torrent/...      | 2.14 GB  | 287 |
| https://1337x.to/torrent/...      | 4.37 GB  | 201 |
```

## Health weight formula

```
weight = min(seeders, q33_seeders) + min(seeders, avg_seeders)
       + leechers % q95_leechers + sizeGB % q80_sizeGB
```

Higher weight = better health. The percentile anchors prevent a single outlier with huge seeder
counts from dominating every search.

## Files

| File | Description |
|---|---|
| `index.js` | Entry point: argument parsing, scoring, filtering, table output |
| `133x-puppeteer.js` | Puppeteer scraper for 1337x search results |
| `utils.js` | Size conversion and quantile helpers |

## Dependencies

- [puppeteer](https://github.com/puppeteer/puppeteer) — headless browser for scraping
- [tablemark](https://github.com/nicolo-ribaudo/tablemark) — formats arrays as Markdown tables
- [cheerio](https://github.com/cheeriojs/cheerio) — HTML parsing (available, not currently used in the main path)

## Contributing

Open a pull request against `main`. If 1337x changes their HTML structure, the selector
`table.table-list tbody tr` in `133x-puppeteer.js` will need updating. See [CONTRIBUTING.md](CONTRIBUTING.md).
