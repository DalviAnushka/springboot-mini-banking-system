package com.banking.banking_app.repository;

import com.banking.banking_app.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByFromAccountOrToAccount(String fromAcc, String toAcc);
    List<Transaction> findAllByOrderByDateTimeDesc();

}
