import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ExpenseService } from '../service/expense-service';
import { Expense } from '../interface/expense';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  @Output() expenseAdded = new EventEmitter<Expense>();
  today: string = new Date().toISOString().split('T')[0];
  btnNameChange = false;
  isSaving = false;

  newExpense: Expense = {
    _id: '',
    title: '',
    amount: 0,
    category: '',
    date: new Date(),
  };

  constructor(private expenseList: ExpenseService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.expenseList.editExpense$.subscribe((data) => {
      if (data) {
        this.newExpense = { ...data };
        this.btnNameChange = true;
      } else {
        this.newExpense = { _id: '', title: '', amount: 0, category: '', date: new Date() };
        this.btnNameChange = false;
      }
    });
  }

  addExpense() {
    if (!this.newExpense.title?.trim()) {
      this.snackBar.open('Please enter a description.', 'Close', { duration: 3000 });
      return;
    }
    if (!this.newExpense.category) {
      this.snackBar.open('Please select a category.', 'Close', { duration: 3000 });
      return;
    }
    if (!this.newExpense.amount || this.newExpense.amount <= 0) {
      this.snackBar.open('Please enter a valid amount greater than 0.', 'Close', { duration: 3000 });
      return;
    }
    if (!this.newExpense.date) {
      this.snackBar.open('Please select a date.', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;

    if (!this.btnNameChange) {
      this.expenseList.postExpenseDetails(this.newExpense).subscribe({
        next: (savedExpense: any) => {
          this.expenseAdded.emit(savedExpense);
          this.newExpense = { _id: '', title: '', amount: 0, category: '', date: new Date() };
          this.isSaving = false;
          this.snackBar.open('Expense added!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.isSaving = false;
          this.snackBar.open('Failed to add expense. Please try again.', 'Close', { duration: 4000 });
        },
      });
    } else {
      this.expenseList.editExpenseDetails(this.newExpense).subscribe({
        next: (savedExpense: any) => {
          this.expenseAdded.emit(savedExpense);
          this.isSaving = false;
          this.btnNameChange = false;
          this.clear();
          this.snackBar.open('Expense updated!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.isSaving = false;
          this.snackBar.open('Failed to update expense. Please try again.', 'Close', { duration: 4000 });
        },
      });
    }
  }

  clear() {
    this.newExpense = { _id: '', title: '', amount: 0, category: '', date: new Date() };
    this.btnNameChange = false;
    this.expenseList.setEditExpense(null);
  }
}
