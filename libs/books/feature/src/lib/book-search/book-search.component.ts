import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  searchForm = this.fb.group({
    searchTerm: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) { }

  get searchTerm(): string {
    return this.searchForm.value.searchTerm;
  }

  ngOnInit(): void {
    this.searchForm.get("searchTerm").valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.searchBooks();
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.searchTerm.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.searchTerm) {
      this.store.dispatch(searchBooks({ searchTerm: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
