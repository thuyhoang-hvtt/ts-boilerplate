<h1 align="center">
  <br>
  0x's Boilerplate
  <br>
</h1>

## 🗃️ Table of Contents

- [🗃️ Table of Contents](#️-table-of-contents)
- [🚀 Quick Start](#-quick-start)
  - [📦 Installation](#-installation)
  - [🚑 Setup Database Locally](#-setup-database-locally)
  - [🧑‍💻 Run \& Build](#-run--build)
  - [⚗️  typeorm-cli](#️--typeorm-cli)
- [💎 The Package Features](#-the-package-features)
- [🚀 Set up hosting environment](#-set-up-hosting-environment)
  - [Set up Node](#set-up-node)
  - [Set up Redis](#set-up-redis)
  - [Set up pm2](#set-up-pm2)
  - [Set up repo](#set-up-repo)

## 🚀 Quick Start

### 📦 Installation


```bash
# Checkout project
cd api-gateway

# Install node using nvm
nvm use .

# Install typescript globally
npm install -g ts-node

# Install dependencies
npm install
```

### 🚑 Setup Database Locally

```bash
# Docker already installed, run only databases
docker-compose up -d db
```

### 🧑‍💻 Run & Build
```bash
# Run in dev mode
cp .env.example .env
npm run dev

# Run in prod mode locally
cp .env.example .env
npm run start

# Finally, check out Swagger docs at 'http://localhost/docs'
...
```

### ⚗️  typeorm-cli

```bash
# Typeorm is already injected to use with node_modules
# Run script `typeorm` with any appropriate commands
# In case that needs to pass arguments, use `--`. Example
npm run typeorm migration:generate -- -n adduserstable.migration

# To run migration
npm run typeorm migration:run
```

## 💎 The Package Features

- Application

  - ![](https://img.shields.io/badge/-TypeScript-007ACC?style=for-the-badge&logo=TypeScript&logoColor=fff)
    ![](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=fff)
    ![](https://img.shields.io/badge/-NPM-CB3837?style=for-the-badge&logo=NPM&logoColor=fff)
    ![](https://img.shields.io/badge/-NGINX-269539?style=for-the-badge&logo=NGINX&logoColor=fff)

- DevOps

  - ![](https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=fff)
    ![](https://img.shields.io/badge/-Nodemon-76D04B?style=for-the-badge&logo=Nodemon&logoColor=fff)
    ![](https://img.shields.io/badge/-PM2-2B037A?style=for-the-badge&logo=PM2&logoColor=fff)
    ![](https://img.shields.io/badge/-ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=fff)
    ![](https://img.shields.io/badge/-Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=000)
    ![](https://img.shields.io/badge/-Jest-C21325?style=for-the-badge&logo=Jest&logoColor=fff)
    ![](https://img.shields.io/badge/-SWC-FFFFFF?style=for-the-badge&logo=swc&logoColor=FBE1A6)

- Utilities

  - ![](https://img.shields.io/badge/-Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=000)

- Database
  - ![](https://img.shields.io/badge/-MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=fff)
    ![](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=fff)
    ![](https://img.shields.io/badge/-Redis-7a060c?style=for-the-badge&logo=Redis&logoColor=fff)

## 🚀 Set up hosting environment

### Set up Node

```bash
# Install nvm, see: https://github.com/nvm-sh/nvm#install--update-script
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Recompile script
source ~/.bashrc

# Install node v16.13.1 with nvm
nvm install v16.13.1

# Register auto detect .nvmrc
enter_directory() {
  if [[ $PWD == $PREV_PWD ]]; then
    return
  fi

  PREV_PWD=$PWD
  [[ -f ".nvmrc" ]] && nvm use
}
export PROMPT_COMMAND=enter_directory

# Recompile script
source ~/.bashrc
```

### Set up Redis
```bash
# Install redis
sudo apt update && apt install redis

# Edit conf to require password --> Uncomment requirepass
sudo vim /etc/redis/redis.conf

# Restart redis server
sudo systemctl restart redis.service
```

### Set up pm2
```bash
# Install pm2 at global, ensure to use node v16.13.1
npm install -g pm2

# Add pm2 logrotate dependency, see https://github.com/keymetrics/pm2-logrotate#install
pm2 install pm2-logrotate

# Config logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:compress true
```

### Set up repo
```bash
# Config git & token to have access to pull repo 
git clone https://<GITHUB_ACCESS_TOKEN>@github.com/aptos-team/api-gateway.git app

# Fulfill .env variables
cp .env.example .env
vim .env

# Checkout repo then run corresponding Makefile script
# For example, if want to start API for test
make pm2_test
```
