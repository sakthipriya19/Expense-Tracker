import { Component, Input, SimpleChanges } from '@angular/core';
import { ExpenseService } from '../service/expense-service';
import { Expense } from '../interface/expense';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
 selector: 'app-expense-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-summary.html',
  styleUrl: './expense-summary.css'
})
export class ExpenseSummary {
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];
  length = 0;
  displayedExpenses: Expense[] = [];
  @Input() getNewData: Expense | null = null;
  totalExpense: number = 0;
  userData: Expense[] = [];
  fromDate: string = '';
  toDate: string = '';
  filteredExpenses: Expense[] = [];
  originalData: Expense[] = [];

  constructor(private expenseList: ExpenseService) {}

  ngOnInit() {
    this.loadExpenses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['getNewData'] && this.getNewData) {
      const newData = this.getNewData;
      const index = this.userData.findIndex((exp) => exp._id === newData._id);
      if (index !== -1) {
        this.userData[index] = newData;
        const originalIndex = this.originalData.findIndex((exp) => exp._id === newData._id);
        if (originalIndex !== -1) {
          this.originalData[originalIndex] = newData;
        }
      } else {
        this.userData.unshift(newData);
        this.originalData.unshift(newData);
      }
      this.resetPagination();
      this.totalChange();
    }
  }

  loadExpenses() {
    this.expenseList.getExpenseDeatils().subscribe((data: Expense[]) => {
      this.originalData = data;
      this.userData = [...data];
      this.resetPagination();
      this.totalChange();
    });
  }

  deleteItem(id: string) {
    if (id) {
      alert('The Expense Details will be deleted');
      this.expenseList.deleteExpenseDetails(id).subscribe(() => {
        this.userData = this.userData.filter((expense) => expense._id !== id);
        this.originalData = this.originalData.filter((expense) => expense._id !== id);
        this.resetPagination();
        this.totalChange();
      });
    }
  }

  onEdit(data: Expense) {
    this.expenseList.setEditExpense(data);
  }

  applyDateFilter() {
    if (!this.originalData.length) {
      this.originalData = [...this.userData];
    }

    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);
      if (from >= to) {
        alert('Please provide correct date');
        this.clearFilter();
        return;
      }
      this.filteredExpenses = this.originalData.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= from && expDate <= to;
      });
      this.userData = [...this.filteredExpenses];
    } else {
      this.userData = [...this.originalData];
    }

    this.resetPagination();
    this.totalChange();
  }

  clearFilter() {
    this.fromDate = '';
    this.toDate = '';
    this.userData = [...this.originalData];
    this.resetPagination();
    this.totalChange();
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.updateDisplayedExpenses();
    }
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.updateDisplayedExpenses();
    }
  }

  setPageSize(size: number | string) {
    this.pageSize = Number(size);
    this.resetPagination();
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.length / this.pageSize));
  }

  resetPagination() {
    this.pageIndex = 0;
    this.length = this.userData.length;
    this.updateDisplayedExpenses();
  }

  updateDisplayedExpenses() {
    this.length = this.userData.length;
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedExpenses = this.userData.slice(startIndex, endIndex);
  }

  totalChange() {
    this.totalExpense = this.userData.reduce((sum, exp) => sum + Number(exp.amount), 0);
    this.expenseList.expenses.set(this.userData);
  }

  addToCSV() {
    this.expenseList.exportToCsv(this.userData, 'expense-report.csv');
  }
}
