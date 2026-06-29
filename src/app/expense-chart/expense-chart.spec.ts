``
import { TestBed } from '@angular/core/testing';
import { ExpenseChart } from './expense-chart';
import { ExpenseService } from '../service/expense-service';
import { Expense } from '../interface/expense';

describe('ExpenseChart', () => {
  let component: ExpenseChart;
  let expenseService: ExpenseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ExpenseService],
    });
  });

  beforeEach(() => {
    expenseService = TestBed.inject(ExpenseService);
    component = new ExpenseChart(expenseService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default pie chart options', () => {
    expect(component.pieChartOptions).toEqual({
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Expense Breakdown by Category' },
      },
    });
  });

  it('should compute pie chart data with no expenses', () => {
    spyOn(expenseService, 'expenses').and.returnValue([]);
    const pieChartData = component.pieChartData;
    expect(pieChartData().labels).toEqual([]);
    expect(pieChartData().datasets).toEqual([
      {
        data: [],
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
    ]);
  });

  it('should compute pie chart data with one expense', () => {
    const expense: Expense = {
      category: 'Test Category', amount: 100,
      _id: '',
      title: '',
      date: new Date()
    };
    spyOn(expenseService, 'expenses').and.returnValue([expense]);
    const pieChartData = component.pieChartData;
    expect(pieChartData().labels).toEqual(['Test Category']);
    expect(pieChartData().datasets).toEqual([
      {
        data: [100],
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
    ]);
  });

  it('should compute pie chart data with multiple expenses', () => {
    const expense1: Expense = {
      category: 'Test Category 1', amount: 100,
      _id: '',
      title: '',
      date: new Date()
    };
    const expense2: Expense = {
      category: 'Test Category 2', amount: 200,
      _id: '',
      title: '',
      date: new Date()
    };
    const expense3: Expense = {
      category: 'Test Category 1', amount: 50,
      _id: '',
      title: '',
      date: new Date()
    };
    spyOn(expenseService, 'expenses').and.returnValue([expense1, expense2, expense3]);
    const pieChartData = component.pieChartData;
    expect(pieChartData().labels).toEqual(['Test Category 1', 'Test Category 2']);
    expect(pieChartData().datasets).toEqual([
      {
        data: [150, 200],
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
    ]);
  });
});