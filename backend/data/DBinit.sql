CREATE TABLE IF NOT EXISTS CoinValue (
    coin TEXT NOT NULL,
    entryDate TEXT NOT NULL,
    price REAL NOT NULL

    CONSTRAINT unique_entry UNIQUE (coin, entryDate)
);
