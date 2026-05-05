# wallet-transactions

Minimal REST API for wallet transactions used to demonstrate CI checks, build/package, and security gates.

## Endpoints

- `GET /health`
- `GET /wallets/:id/balance`
- `POST /wallets/:id/credit`
- `POST /wallets/:id/debit`
- `GET /wallets/:id/transactions`

## Run

```bash
npm install
npm test
npm start
