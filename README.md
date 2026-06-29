# Expense Tracker

An Angular-based expense tracker application that records, edits, and visualizes expense data using a remote REST API.

This project is built with Angular 21 and includes a pie chart summary of spending categories, editable expense entries, and a total expense overview.

---

## Features
- Add new expenses with title, category, amount, and date
- Edit existing expenses using the same form
- Delete expenses from the list
- View a running total of all expenses
- Visualize category totals with a Chart.js pie chart
- Uses a remote MockAPI backend for persistent data storage
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
- `src/app/service/expense-service.ts` — API service for MockAPI backend
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

## Notes
- The app uses a remote MockAPI endpoint at `https://6a22a9875c610353286a23c3.mockapi.io/expense`
- The `Header` component sends expense changes to the summary component via an event emitter
- The pie chart updates based on category totals retrieved from the backend

---

## License
This repository does not include a license file. Add one if you want to share or publish this project publicly.
