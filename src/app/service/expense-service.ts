import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Expense } from '../interface/expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private editExpenseSource = new BehaviorSubject<Expense | null>(null);
  editExpense$ = this.editExpenseSource.asObservable();
  url = 'https://6a22a9875c610353286a23c3.mockapi.io/expense';

  expenses = signal<Expense[]>([]);

  constructor(private http: HttpClient) {}

  setEditExpense(expense: Expense) {
    this.editExpenseSource.next(expense);
  }

  getExpenseDeatils(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.url);
  }
  postExpenseDetails(data: any) {
    return this.http.post<Expense[]>(this.url, data);
  }
  deleteExpenseDetails(id: string): Observable<void> {
    const url = `https://6a22a9875c610353286a23c3.mockapi.io/expense/${id}`;
    return this.http.delete<void>(url);
  }
  editExpenseDetails(user: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.url}/${user._id}`, user);
  }
  exportToCsv(expense: Expense[], filename: string = '') {
    const headers = ['Description', 'Category', 'Amount', 'Date'];
    const rows = expense.map((exp) => [exp.title, exp.category, exp.amount, exp.date]);
    const csvContent = [headers, ...rows].map((data) => data.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }
}
