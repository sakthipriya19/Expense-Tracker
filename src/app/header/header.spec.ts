``
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { ExpenseService } from '../service/expense-service';
import { Expense } from '../interface/expense';
import { of } from 'rxjs';

describe('Header', () => {
  let service: Header;
  let fixture: ComponentFixture<Header>;
  let expenseService: ExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ExpenseService, useClass: ExpenseServiceStub }
      ],
      declarations: [Header]
    });
    fixture = TestBed.createComponent(Header);
    service = fixture.componentInstance;
    expenseService = TestBed.inject(ExpenseService);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize today with current date', () => {
    expect(service.today).toBe(new Date().toISOString().split('T')[0]);
  });

  it('should initialize newExpense with default values', () => {
    expect(service.newExpense).toEqual({
      _id: '',
      title: '',
      amount: 0,
      category: '',
      date: new Date()
    });
  });

  it('should call expenseList.editExpense$ subscription when ngAfterViewInit is called', () => {
    expenseService.editExpense$ = of({ _id: 'id', title: 'title', amount: 10, category: 'category', date: new Date() });
    service.ngAfterViewInit();
    expect(service.newExpense).toEqual({ _id: 'id', title: 'title', amount: 10, category: 'category', date: new Date() });
  });

  it('should update newExpense and btnNameChange when expenseList.editExpense$ subscription emits data', () => {
    expenseService.editExpense$ = of({ _id: 'id', title: 'title', amount: 10, category: 'category', date: new Date() });
    service.ngAfterViewInit();
    expect(service.newExpense).toEqual({ _id: 'id', title: 'title', amount: 10, category: 'category', date: new Date() });
    expect(service.btnNameChange).toBe(true);
  });

  // it('should call expenseList.postExpenseDetails when addExpense is called and newExpense is not edited', () => {
  //   const expenseListSpy = spyOn(expenseService, 'postExpenseDetails').and.returnValue(of({ _id: 'id', title: 'title', amount: 10, category: 'category', date: new Date() }));
  //   service.addExpense();
  //   expect(expenseListSpy).toHaveBeenCalledTimes(1);
  // });

  it('should call expenseList.editExpenseDetails when addExpense is called and newExpense is edited', () => {
    service.btnNameChange = true;
    const expenseListSpy = spyOn(expenseService, 'editExpenseDetails').and.returnValue(of({ _id: 'id', title: 'title', amount: 10, category: 'category', date: new Date() }));
    service.addExpense();
    expect(expenseListSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit expenseAdded event when addExpense is called and newExpense is not edited', () => {
    const expenseAddedSpy = spyOn(service.expenseAdded, 'emit');
    service.addExpense();
    expect(expenseAddedSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit expenseAdded event when addExpense is called and newExpense is edited', () => {
    service.btnNameChange = true;
    const expenseAddedSpy = spyOn(service.expenseAdded, 'emit');
    service.addExpense();
    expect(expenseAddedSpy).toHaveBeenCalledTimes(1);
  });

  it('should clear newExpense when clear is called', () => {
    service.clear();
    expect(service.newExpense).toEqual({ _id: '', title: '', amount: 0, category: '', date: new Date() });
  });
});

class ExpenseServiceStub {
  editExpense$ = of({ _id: 'id', title: 'title', amount: 10, category: 'category', date: new Date() });
  postExpenseDetails = () => of({ _id: 'id', title: 'title', amount: 10, category: 'category', date: new Date() });
  editExpenseDetails = () => of({ _id: 'id', title: 'title', amount: 10, category: 'category', date: new Date() });
  expenses = new Map();
}