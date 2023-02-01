APP_NAME = <INPUT HERE>
APP_NAME := $(APP_NAME)

# Pull the latest code on repo
pull_n_install:
	git pull
	npm install

# Run on PM2
pm2_test: pull_n_install
	npm run typeorm migration:run
	npm run deploy:test

# Run on PM2 on Staging
pm2_staging: pull_n_install
	npm run typeorm migration:run
	npm run deploy:staging

# Run on PM2 on Live
pm2_live: pull_n_install
	npm run typeorm migration:run
	npm run deploy:live

onchain_test: pull_n_install
	npm run typeorm migration:run
	npm run onchain:test

onchain_staging: pull_n_install
	npm run typeorm migration:run
	npm run onchain:staging

onchain_prod: pull_n_install
	npm run typeorm migration:run
	npm run onchain:prod

cron: pull_n_install
	npm run cron:all

all: pull_n_install
