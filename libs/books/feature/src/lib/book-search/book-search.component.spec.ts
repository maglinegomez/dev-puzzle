import { fakeAsync, async, tick, ComponentFixture, TestBed, discardPeriodicTasks } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { getAllBooks, searchBooks } from '@tmo/books/data-access';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: getAllBooks,
              value: []
            }
          ]
        })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should not dispatch searchBooks action when user enter search term and elapsed time after input is less than 500ms', fakeAsync(() => {
    component.searchForm.get('searchTerm').setValue('abc');
    tick(300);

    expect(store.dispatch).not.toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('should dispatch searchBooks action when user enter search term and elapsed time after input is 500ms', fakeAsync(() => {
    component.searchForm.get('searchTerm').setValue('xyz');
    tick(500);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(searchBooks({ searchTerm: 'xyz' }));
  }));

  it('should not dispatch searchBooks action when user enters the search term same as the previously entered one', fakeAsync(() => {
    component.searchForm.get('searchTerm').setValue('xyz');
    tick(500);

    expect(store.dispatch).toHaveBeenCalledTimes(1);

    component.searchForm.get('searchTerm').setValue('xyz');
    tick(500);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
  }));

});
