import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { ExpenseSummary } from "./expense-summary";

describe('ExpenseSummary', () => {
  let service: ExpenseSummary;
  let fixture: ComponentFixture<ExpenseSummary>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [],
      declarations: [ExpenseSummary]
    });
    fixture = TestBed.createComponent(ExpenseSummary);
    service = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize pageSize, pageIndex, pageSizeOptions, length, displayedExpenses, getNewData, totalExpense, userData, fromDate, toDate, filteredExpenses, originalData', () => {
    expect(service.pageSize).toBe(5);
    expect(service.pageIndex).toBe(0);
    expect(service.pageSizeOptions).toEqual([5, 10, 25, 100]);
    expect(service.length).toBe(0);
    expect(service.displayedExpenses).toEqual([]);
    expect(service.getNewData).toBeNull();
    expect(service.totalExpense).toBe(0);
    expect(service.userData).toEqual([]);
    expect(service.fromDate).toBe('');
    expect(service.toDate).toBe('');
    expect(service.filteredExpenses).toEqual([]);
    expect(service.originalData).toEqual([]);
  });

  it('should call loadExpenses when ngOnInit is called', () => {
    spyOn((service as any).expenseList, 'getExpenseDeatils').and.returnValue(of([]));
    service.ngOnInit();
    expect((service as any).expenseList.getExpenseDeatils).toHaveBeenCalledTimes(1);
  });

  it('should update userData and originalData when getNewData is changed', () => {
    const newData = { _id: '1', title: 'test', amount: 0, category: 'test', date:  new Date('2022-01-01') };
    service.getNewData = newData;
    service.ngOnChanges({ getNewData: {
      currentValue: newData, isFirstChange: () => false,
      previousValue: undefined,
      firstChange: false
    } });
    expect(service.userData).toContain(newData);
    expect(service.originalData).toContain(newData);
  });

  it('should delete item from userData and originalData when deleteItem is called', () => {
    const id = '1';
    service.deleteItem(id);
    expect(service.userData.some(item => item._id === id)).toBeFalse();
    expect(service.originalData.some(item => item._id === id)).toBeFalse();
  });

  it('should call onEdit when onEdit is called', () => {
    const data = { _id: '1', title: 'test', amount: 0, category: 'test', date: new Date('2022-01-01') };
    service.onEdit(data);
    expect((service as any).expenseList.setEditExpense).toHaveBeenCalledTimes(1);
    expect((service as any).expenseList.setEditExpense).toHaveBeenCalledWith(data);
  });

  it('should apply date filter when applyDateFilter is called', () => {
    const fromDate = '2022-01-01';
    const toDate = '2022-01-31';
    service.fromDate = fromDate;
    service.toDate = toDate;
    service.applyDateFilter();
    expect(service.filteredExpenses).not.toEqual([]);
  });

  it('should clear filter when clearFilter is called', () => {
    service.fromDate = '2022-01-01';
    service.toDate = '2022-01-31';
    service.clearFilter();
    expect(service.fromDate).toBe('');
    expect(service.toDate).toBe('');
    expect(service.userData).toEqual([]);
  });

  it('should update displayedExpenses when previousPage is called', () => {
    service.pageIndex = 1;
    service.previousPage();
    expect(service.displayedExpenses).not.toEqual([]);
  });

  it('should update displayedExpenses when nextPage is called', () => {
    service.pageIndex = 0;
    service.nextPage();
    expect(service.displayedExpenses).not.toEqual([]);
  });

  it('should update displayedExpenses when setPageSize is called', () => {
    service.pageSize = 10;
    service.setPageSize(10);
    expect(service.displayedExpenses).not.toEqual([]);
  });

  it('should update totalExpense when totalChange is called', () => {
    const userData = [
      { _id: '1', title: 'test1', amount: 10, category: 'test', date: new Date('2022-01-01') },
      { _id: '2', title: 'test2', amount: 20, category: 'test', date: new Date('2022-01-02') }
    ];
    service.userData = userData;
    service.totalChange();
    expect(service.totalExpense).toBe(30);
  });

  it('should call exportToCsv when addToCSV is called', () => {
    spyOn((service as any).expenseList, 'exportToCsv').and.returnValue(of([]));
    service.addToCSV();
    expect((service as any).expenseList.exportToCsv).toHaveBeenCalledTimes(1);
  });
});