package com.banking.banking_app.service;

import com.banking.banking_app.model.Account;
import com.banking.banking_app.model.Transaction;
import com.banking.banking_app.repository.AccountRepository;
import com.banking.banking_app.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BankService {

    private final AccountRepository accountRepo;
    private final TransactionRepository transactionRepo;

    public BankService(AccountRepository accountRepo, TransactionRepository transactionRepo) {
        this.accountRepo = accountRepo;
        this.transactionRepo = transactionRepo;
    }

    // Create account
    public Account createAccount(Account account) {
        account.setAccountNo(UUID.randomUUID().toString().substring(0, 8));
        account.setBalance(0.0);
        return accountRepo.save(account);
    }

    // Show all accounts
    public List<Account> getAllAccounts() {
        return accountRepo.findAll();
    }

    // Get account by id (only ONE version needed)
    public Account getAccountById(Long id) {
        return accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    // Deposit
    public Account deposit(Long id, double amount) {
        Account acc = getAccountById(id);
        acc.setBalance(acc.getBalance() + amount);

        // Save transaction
        Transaction t = new Transaction("DEPOSIT", amount, null, acc.getAccountNo());
        transactionRepo.save(t);

        return accountRepo.save(acc);
    }

    // Withdraw
    public Account withdraw(Long id, double amount) {
        Account acc = getAccountById(id);

        if (acc.getBalance() < amount)
            throw new RuntimeException("Insufficient balance");

        acc.setBalance(acc.getBalance() - amount);

        // Save transaction
        Transaction t = new Transaction("WITHDRAW", amount, acc.getAccountNo(), null);
        transactionRepo.save(t);

        return accountRepo.save(acc);
    }

    // Transfer
    public void transfer(Long fromId, Long toId, double amount) {
        Account sender = getAccountById(fromId);
        Account receiver = getAccountById(toId);

        if (sender.getBalance() < amount)
            throw new RuntimeException("Insufficient balance");

        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        accountRepo.save(sender);
        accountRepo.save(receiver);

        // Transaction entry (Debit)
        Transaction debitTxn = new Transaction("TRANSFER_DEBIT", amount, sender.getAccountNo(), receiver.getAccountNo());
        transactionRepo.save(debitTxn);

        // Transaction entry (Credit)
        Transaction creditTxn = new Transaction("TRANSFER_CREDIT", amount, sender.getAccountNo(), receiver.getAccountNo());
        transactionRepo.save(creditTxn);
    }

    // Fetch History
    public List<Transaction> getTransactions(String accNo) {
        return transactionRepo.findByFromAccountOrToAccount(accNo, accNo);
    }

    //All History
    public List<Transaction> getAllTransactions() {
        return transactionRepo.findAll();
    }


}
