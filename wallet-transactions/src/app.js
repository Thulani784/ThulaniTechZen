const express = require('express');

const app = express();
app.use(express.json());

const wallets = new Map(); // in-memory store: walletId -> { balance, transactions }

function getWallet(id) {
  if (!wallets.has(id)) {
    wallets.set(id, { balance: 0, transactions: [] });
  }
  return wallets.get(id);
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/wallets/:id/balance', (req, res) => {
  const wallet = getWallet(req.params.id);
  res.json({ walletId: req.params.id, balance: wallet.balance });
});

app.post('/wallets/:id/credit', (req, res) => {
  const { amount, reference } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'invalid amount' });
  }
  const wallet = getWallet(req.params.id);
  wallet.balance += amount;
  const tx = {
    id: wallet.transactions.length + 1,
    type: 'credit',
    amount,
    reference: reference || null,
    createdAt: new Date().toISOString()
  };
  wallet.transactions.push(tx);
  res.status(201).json(tx);
});

app.post('/wallets/:id/debit', (req, res) => {
  const { amount, reference } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'invalid amount' });
  }
  const wallet = getWallet(req.params.id);
  if (wallet.balance < amount) {
    return res.status(409).json({ error: 'insufficient funds' });
  }
  wallet.balance -= amount;
  const tx = {
    id: wallet.transactions.length + 1,
    type: 'debit',
    amount,
    reference: reference || null,
    createdAt: new Date().toISOString()
  };
  wallet.transactions.push(tx);
  res.status(201).json(tx);
});

app.get('/wallets/:id/transactions', (req, res) => {
  const wallet = getWallet(req.params.id);
  res.json(wallet.transactions);
});

module.exports = app;
