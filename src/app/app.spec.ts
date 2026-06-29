``
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Expense } from './interface/expense';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a savedData property', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.savedData).toBeNull();
  });

  it('should have a title property', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    expect(app.title).toBe('Insurance');
  });

  it('should call sentToExpenseSummary when data is sent', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const spy = spyOn(app, 'sentToExpenseSummary');
    app.sentToExpenseSummary({} as Expense);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update savedData when sentToExpenseSummary is called', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const data = { id: 1, name: 'Test' } as unknown as Expense;
    app.sentToExpenseSummary(data);
    expect(app.savedData).toEqual(data);
  });

  it('should log savedData to console when sentToExpenseSummary is called', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const spy = spyOn(console, 'log');
    app.sentToExpenseSummary({} as Expense);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});