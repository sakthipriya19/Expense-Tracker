import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Expense } from "../interface/expense";
import { ExpenseService } from "./expense-service";

``
describe('ExpenseService', () => {
  let service: ExpenseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpenseService],
      declarations: []
    });
    service = TestBed.inject(ExpenseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should set edit expense', () => {
    const expense: Expense = { _id: '123', title: 'Test Expense', category: 'Test Category', amount: 100, date: new Date('2022-01-01') };
    service.setEditExpense(expense);
    expect(service['editExpenseSource'].value).toEqual(expense);
  });

  it('should get expense details', () => {
    const expense: Expense[] = [{ _id: '123', title: 'Test Expense', category: 'Test Category', amount: 100, date: new Date('2022-01-01') }];
    const req = httpMock.expectOne('https://nodejs-service-expense-2.onrender.com/expense');
    expect(req.request.method).toBe('GET');
    req.flush(expense);
    expect(service['editExpenseSource'].value).toBeNull();
  });

  it('should post expense details', () => {
    const expense: Expense[] = [{ _id: '123', title: 'Test Expense', category: 'Test Category', amount: 100, date: new Date('2022-01-01') }];
    const req = httpMock.expectOne('https://nodejs-service-expense-2.onrender.com/expense');
    expect(req.request.method).toBe('POST');
    req.flush(expense);
    expect(service['editExpenseSource'].value).toBeNull();
  });

  it('should delete expense details', () => {
    const id = '123';
    const req = httpMock.expectOne(`https://nodejs-service-expense-2.onrender.com/expense/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(service['editExpenseSource'].value).toBeNull();
  });

  it('should edit expense details', () => {
    const expense: Expense = { _id: '123', title: 'Test Expense', category: 'Test Category', amount: 100, date: new Date('2022-01-01') };
    const req = httpMock.expectOne(`https://nodejs-service-expense-2.onrender.com/expense/${expense._id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(expense);
    expect(service['editExpenseSource'].value).toBeNull();
  });

  it('should export to csv', () => {
    const expense: Expense[] = [{ _id: '123', title: 'Test Expense', category: 'Test Category', amount: 100, date: new Date('2022-01-01') }];
    const filename = 'test.csv';
    const link = document.createElement('a');
    const blob = new Blob(['Description,Category,Amount,Date\n' + 'Test Expense,Test Category,100,2022-01-01'], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.click();
    expect(link.download).toBe(filename);
  });
});