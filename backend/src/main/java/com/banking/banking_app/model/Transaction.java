package com.banking.banking_app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "transaction_table") // to avoid SQL keyword issue
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private double amount;

    private String fromAccount;
    private String toAccount;

    private LocalDateTime dateTime;

    public Transaction() {
    }

    public Transaction(String type, double amount, String fromAccount, String toAccount) {
        this.type = type;
        this.amount = amount;
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.dateTime = LocalDateTime.now(); // Automatically set timestamp
    }

    // --------- Getters & Setters ----------

}
