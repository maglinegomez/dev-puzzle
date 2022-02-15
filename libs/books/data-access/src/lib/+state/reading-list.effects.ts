import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of, EMPTY } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, skipUndo }) =>
        this.http.post('/api/reading-list', book).pipe(
          mergeMap(() => {
            const item = { ...book, bookId: book.id };
            if (!skipUndo) {
              return of(ReadingListActions.undoAction({
                message: "Book is added to reading list",
                undoAction: ReadingListActions.removeFromReadingList({ item, skipUndo: true })
              }));
            }
            return EMPTY;
          }),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      ),

    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, skipUndo }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          mergeMap(() => {
            const book = { ...item, id: item.bookId };
            if (!skipUndo) {
              return of(ReadingListActions.undoAction({
                message: "Book is removed from reading list",
                undoAction: ReadingListActions.addToReadingList({ book, skipUndo: true })
              })
              );
            }
            return EMPTY;
          }

          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  undoEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.undoAction),
      concatMap(({ message, undoAction }) => this.snackBar.open(message, "Undo", { duration: 5000 }).onAction()
        .pipe(
          map(() => undoAction)
        )
      ),
    )
  );


  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }
}
