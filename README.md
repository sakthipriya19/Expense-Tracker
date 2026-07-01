# Expense Tracker

An Angular-based expense tracker application that records, edits, and visualizes expense data using a remote REST API.

This project is built with Angular 21 and includes a pie chart summary of spending categories, editable expense entries, and a total expense overview.

**Live app:** https://expense-tracker-beta-eight-24.vercel.app

---

## Features
- Add new expenses with title, category, amount, and date
- Edit existing expenses using the same form
- Delete expenses from the list
- Date-range filtering and pagination over the transaction list
- View a running total of all expenses vs. monthly budget
- Visualize category totals with a Chart.js pie chart
- Export the current transaction list to CSV
- Uses the [NodeJs_Service_Expense](../NodeJs_Service_Expense) REST API backend for persistent data storage
- Includes SSR-ready Express server setup for production deployment

---

## Tech Stack
- Angular 21 (`@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`)
- Angular SSR (`@angular/ssr`, `express`)
- Chart.js + `ng2-charts`
- RxJS for observable data flows
- TypeScript

---

## Project Structure
- `src/app/app.ts` — root application component
- `src/app/header/` — expense form and add/edit logic
- `src/app/expense-summary/` — expense list, delete/edit actions, totals
- `src/app/expense-chart/` — chart visualization of category totals
- `src/app/service/expense-service.ts` — API service for the backend (`url` points at the Render-hosted API)
- `src/app/interface/expense.ts` — expense model definition
- `src/server.ts` — Express-based SSR entry point

---

## Getting Started

### Install dependencies
```bash
npm install
```

### Run in development mode
```bash
npm start
```

Open `http://localhost:4200` in your browser.

### Run unit tests
```bash
npm test
```

### Build for production
```bash
npm run build
```

### Run server-side rendered app
```bash
npm run serve:ssr:ExpenseTracker
```

Then open `http://localhost:4000`.

---

## Backend

This app talks to the [NodeJs_Service_Expense](../NodeJs_Service_Expense) Express/MongoDB API for all expense data. The API base URL is set in `src/app/service/expense-service.ts`.

**Live API:** https://nodejs-service-expense-1.onrender.com

The Render service's CORS config must include this app's deployed origin (`https://expense-tracker-beta-eight-24.vercel.app`) or browser requests will be blocked.

---

## Deployment

Deployed on [Vercel](https://vercel.com), which auto-detects the Angular SSR build (zero-config) and runs `npm run build`. To deploy:

```bash
vercel --prod
```

A `.vercelignore` excludes `node_modules`, `dist`, and `.angular` from the upload (the `.angular` build cache contains files over Vercel's 100 MB-per-file limit).

---

## Notes
- The `Header` component sends expense changes to the summary component via an event emitter
- The pie chart updates based on category totals retrieved from the backend

---

## License
This repository does not include a license file. Add one if you want to share or publish this project publicly.

<img width="2872" height="1614" alt="image" src="https://github.com/user-attachments/assets/476ea755-7be3-4847-a07b-372ba8c61da7" />

