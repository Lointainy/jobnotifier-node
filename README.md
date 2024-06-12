Job notifier

## Setup

Create bot [botFather](https://t.me/botfather)

Generate a bot token `73xxxxxx00:AAxxxxxxxxxwA-2xxxxxxxx4c`

setup `.env` file

```env
BOT_TOKEN=73xxxxxx00:AAxxxxxxxxxwA-2xxxxxxxx4
```

- [global config](/config/globals.js) - setup default variables
- [modificate](/bot/botCommands.js) - setup bot commands
- [scraper](/services/jobScraper.js) - logic for scrape site data

## Getting Started

```bash
# dev
npm run server

# prod
npm run start
```

## Commands

`/start` - Run bot

`/stop` - Stop bot

`/filters` - enter a new search filters. Template: `javascript,node`

`/interval` - set the interval between messages

`/count` - set the number of vacancies

