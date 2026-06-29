import { Component, Output, EventEmitter } from '@angular/core';
import { ExpenseService } from '../service/expense-service';
import { Expense } from '../interface/expense';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  @Output() expenseAdded = new EventEmitter<Expense>();
  today: string = new Date().toISOString().split('T')[0];
  btnNameChange: boolean = false;
  newExpense: Expense = {
    _id: '',
    title: '',
    amount: 0,
    category: '',
    date: new Date(),
  };
  constructor(private expenseList: ExpenseService) {}
  ngAfterViewInit() {
    this.expenseList.editExpense$.subscribe((data: any) => {
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
    if (!this.btnNameChange) {
      if (
        !this.newExpense.title ||
        this.newExpense.amount <= 0 ||
        !this.newExpense.category ||
        !this.newExpense.date
      ) {
        alert('Please fill all fields correctly before adding an expense.');
        return;
      }
      this.expenseList.postExpenseDetails(this.newExpense).subscribe((savedExpense: any) => {
        this.expenseAdded.emit(savedExpense);
        this.newExpense = { _id: '', title: '', amount: 0, category: '', date: new Date() };
      });
    } else {
      this.expenseList.editExpenseDetails(this.newExpense).subscribe((savedExpense: any) => {
        this.expenseAdded.emit(savedExpense);
        this.btnNameChange = false;
        this.clear();
      });
    }
    this.expenseList.expenses.set([this.newExpense])
  }
  clear() {
    this.newExpense = { _id: '', title: '', amount: 0, category: '', date: new Date() };
  }
}
