import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExpenseService } from '../service/expense-service';
import { Expense } from '../interface/expense';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-expense-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinner],
  templateUrl: './expense-summary.html',
  styleUrl: './expense-summary.css',
})
export class ExpenseSummary implements OnInit {
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];
  length = 0;
  displayedExpenses: Expense[] = [];
  @Input() getNewData: Expense | null = null;
  totalExpense = 0;
  userData: Expense[] = [];
  fromDate = '';
  toDate = '';
  filteredExpenses: Expense[] = [];
  originalData: Expense[] = [];
  isLoading = false;
  deletingId: string | null = null;

  constructor(private expenseList: ExpenseService, private snackBar: MatSnackBar) {}

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
        if (originalIndex !== -1) this.originalData[originalIndex] = newData;
      } else {
        this.userData.unshift(newData);
        this.originalData.unshift(newData);
      }
      this.resetPagination();
      this.totalChange();
    }
  }

  loadExpenses() {
    this.isLoading = true;
    this.expenseList.getExpenseDeatils().subscribe({
      next: (data: Expense[]) => {
        this.originalData = data;
        this.userData = [...data];
        this.resetPagination();
        this.totalChange();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load expenses. Check your connection and try again.', 'Retry', { duration: 6000 })
          .onAction().subscribe(() => this.loadExpenses());
      },
    });
  }

  deleteItem(id: string) {
    if (!id) return;
    if (!confirm('Delete this expense? This cannot be undone.')) return;

    this.deletingId = id;
    this.expenseList.deleteExpenseDetails(id).subscribe({
      next: () => {
        this.userData = this.userData.filter((e) => e._id !== id);
        this.originalData = this.originalData.filter((e) => e._id !== id);
        this.resetPagination();
        this.totalChange();
        this.deletingId = null;
        this.snackBar.open('Expense deleted.', 'Close', { duration: 3000 });
      },
      error: () => {
        this.deletingId = null;
        this.snackBar.open('Failed to delete expense. Please try again.', 'Close', { duration: 4000 });
      },
    });
  }

  onEdit(data: Expense) {
    this.expenseList.setEditExpense(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  applyDateFilter() {
    if (!this.fromDate || !this.toDate) {
      this.snackBar.open('Please select both From and To dates.', 'Close', { duration: 3000 });
      return;
    }
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);
    if (from > to) {
      this.snackBar.open('"From" date cannot be after "To" date.', 'Close', { duration: 3000 });
      return;
    }
    to.setHours(23, 59, 59, 999);
    this.userData = this.originalData.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= from && expDate <= to;
    });
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
    const start = this.pageIndex * this.pageSize;
    this.displayedExpenses = this.userData.slice(start, start + this.pageSize);
  }

  totalChange() {
    this.totalExpense = this.userData.reduce((sum, exp) => sum + Number(exp.amount), 0);
    this.expenseList.expenses.set(this.userData);
  }

  addToCSV() {
    this.expenseList.exportToCsv(this.userData, 'expense-report.csv');
  }
}
