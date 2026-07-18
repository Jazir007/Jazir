# Ledgerly

A local-first, mobile-friendly Python accounting ERP starter.

## Start it

1. Install Python 3.10+.
2. In this folder run `python -m pip install -r requirements.txt`.
3. Run `python app.py`.
4. Open `http://127.0.0.1:5000` on the laptop. To use it on your phone connected to the same Wi-Fi, open `http://<your-laptop-IP>:5000`.

## Included

- Start by creating a company with its base currency and financial-year dates.
- Separate company records: every company has its own chart of accounts, transactions, and reports.
- Double-entry journal posting with balancing validation.
- Original currency and exchange rate on every journal line.
- Custom chart of accounts and configurable base currency.
- Income statement, statement of financial position, and trial balance.

This is a starter for personal/internal use. Before using it as a production business system, add authentication, encrypted backups, access controls, audit trails, tax rules, and professional accounting review.
