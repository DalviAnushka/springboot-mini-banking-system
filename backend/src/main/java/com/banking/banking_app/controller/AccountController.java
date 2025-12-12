package com.banking.banking_app.controller;

import com.banking.banking_app.model.Account;
import com.banking.banking_app.model.Transaction;
import com.banking.banking_app.service.BankService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    private final BankService bankService;

    public AccountController(BankService bankService) {
        this.bankService = bankService;
    }

    // Create account
    @PostMapping
    public Account createAccount(@RequestBody Account acc) {
        return bankService.createAccount(acc);
    }

    // Get all accounts
    @GetMapping
    public List<Account> getAllAccounts() {
        return bankService.getAllAccounts();
    }

    // Deposit
    @PutMapping("/{id}/deposit")
    public Account deposit(@PathVariable Long id, @RequestParam double amount) {
        return bankService.deposit(id, amount);
    }

    // Withdraw
    @PutMapping("/{id}/withdraw")
    public Account withdraw(@PathVariable Long id, @RequestParam double amount) {
        return bankService.withdraw(id, amount);
    }
    //Transaction History
    @GetMapping("/{id}/transactions")
    public List<Transaction> getTransactions(@PathVariable Long id) {
        Account acc = bankService.getAccountById(id);
        return bankService.getTransactions(acc.getAccountNo());
    }
    //All History
    @GetMapping("/transactions/all")
    public List<Transaction> getAllTransactions() {
        return bankService.getAllTransactions();
    }


    // Transfer
    @PostMapping("/transfer")
    public String transfer(
            @RequestParam Long fromId,
            @RequestParam Long toId,
            @RequestParam double amount) {

        bankService.transfer(fromId, toId, amount);
        return "Transfer Successful!";
    }
    //CSV Export
    @GetMapping("/transactions/export")
    public void exportAllCSV(HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=all-transactions.csv");

        PrintWriter writer = response.getWriter();
        writer.println("ID,TYPE,AMOUNT,FROM,TO,DATE_TIME");

        List<Transaction> list = bankService.getAllTransactions();

        for (Transaction t : list) {
            writer.println(
                    t.getId() + "," +
                            t.getType() + "," +
                            t.getAmount() + "," +
                            (t.getFromAccount() == null ? "-" : t.getFromAccount()) + "," +
                            (t.getToAccount() == null ? "-" : t.getToAccount()) + "," +
                            t.getDateTime()
            );
        }

        writer.flush();
        writer.close();
    }



}
