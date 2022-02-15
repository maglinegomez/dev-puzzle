import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent {
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
