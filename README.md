Job notifier

## Commands

`/start` - Run bot

`/stop` - Stop bot

`/filters` - enter a new search filters. Template: `javascript,node`

`/option` - select a option to search response

`/category` - select a category to search

`/interval` - set the interval between messages

`/count` - set the number of vacancies

## Setup

Create bot [botFather](https://t.me/botfather)

Generate a bot token `73xxxxxx00:AAxxxxxxxxxwA-2xxxxxxxx4c`

Create DB on mongoDB

setup `.env` file

```env
BOT_TOKEN=73xxxxxx00:AAxxxxxxxxxwA-2xxxxxxxx4
DATABASE_URK=xxxxxxx
```

- [global config](/config/globals.js) - setup default variables
- [modificate](/bot/botCommands.js) - setup bot commands
- [scraper](/services/jobScraper.js) - logic for scrape site data
- [commands](/bot/botCommands.js) - bot commands logic
- - [commands callbacks](/bot/botCallbacks.js) - bot commans callbacks logic

## Getting Started

```bash
# dev
npm run server

# prod
npm run start
```
