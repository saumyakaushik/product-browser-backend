# Product Browser Backend

A Node.js and MySQL app for browsing 200,000 products with fast cursor pagination.

## Live Demo

Render app:

```txt
https://product-browser-backend-mvdi.onrender.com

## Features

- Browse products newest first
- Filter by category
- Paginate with cursor pagination
- Seed script generates 200,000 products
- Simple browser UI

## Setup

```bash
npm install

## Deployment

The app is deployed on Render.

The production database is hosted on Aiven MySQL.

Required environment variables:

```txt
PORT
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
DB_SSL