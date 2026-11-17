DROP FUNCTION IF EXISTS safe_withdraw(NUMERIC, TEXT);
DROP FUNCTION IF EXISTS safe_withdraw(NUMERIC, TEXT, TEXT);
DROP FUNCTION IF EXISTS reset_demo();
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS bank_account;

CREATE TABLE bank_account (
    id SERIAL PRIMARY KEY,
    account_name TEXT NOT NULL,
    balance NUMERIC NOT NULL CHECK (balance >= 0),
    safe_mode BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO bank_account (id, account_name, balance)
VALUES (1, 'Team 5 Joint Account', 200000);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    member_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    method TEXT NOT NULL DEFAULT 'Debit Card',
    mode TEXT NOT NULL CHECK (mode IN ('Unsafe', 'Safe')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION safe_withdraw(withdrawal_amount NUMERIC, member TEXT, pay_method TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    current_balance NUMERIC;
BEGIN
    IF withdrawal_amount IS NULL OR withdrawal_amount <= 0 THEN
        RAISE EXCEPTION 'Invalid amount';
    END IF;

    SELECT balance INTO current_balance FROM bank_account WHERE id = 1 FOR UPDATE;

    IF current_balance IS NULL THEN
        RAISE EXCEPTION 'Account not found';
    END IF;
    IF current_balance < withdrawal_amount THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;

    UPDATE bank_account SET balance = balance - withdrawal_amount WHERE id = 1;

    INSERT INTO transactions (member_name, amount, method, mode)
    VALUES (member, withdrawal_amount, pay_method, 'Safe');

    RETURN current_balance - withdrawal_amount;
END;
$$;

CREATE OR REPLACE FUNCTION reset_demo()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM transactions WHERE id > 0;
    UPDATE bank_account SET balance = 200000 WHERE id = 1;
END;
$$;

ALTER TABLE bank_account DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
GRANT SELECT, UPDATE ON bank_account TO anon;
GRANT SELECT, INSERT ON transactions TO anon;
GRANT USAGE, SELECT ON SEQUENCE transactions_id_seq TO anon;
GRANT EXECUTE ON FUNCTION safe_withdraw(NUMERIC, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION reset_demo() TO anon;

NOTIFY pgrst, 'reload schema';