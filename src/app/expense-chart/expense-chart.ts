import { Component, computed, effect, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ExpenseService } from '../service/expense-service';
import { Expense } from '../interface/expense';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './expense-chart.html',
  styleUrls: ['./expense-chart.css'],
})
export class ExpenseChart {
  constructor(private expenseService: ExpenseService) {}
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Expense Breakdown by Category' },
    },
  };


  pieChartData = computed<ChartData<'pie'>>(() => {
    const expenses = this.expenseService.expenses(); 
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach((exp: Expense) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            '#E74C3C',
            '#3498DB',
            '#F1C40F',
            '#9B59B6',
            '#1ABC9C',
            '#D35400',
            '#7F8C8D',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  });
}
