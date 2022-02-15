# Code Review Comments:

-  In book-search.component.html file, formatDate () method is used to format the date instead of pipe. (Fixed)    
  -  Function call triggers with every change detection which can be prevented by using pipe. It improves application performance.
-  In book-search.component.ts, subscribe is used instead of async pipe for listing of books (Fixed)
  -  You must manually unsubscribe from observable on component destruction which can be prevented by async pipe. It unsubscribe observable when component gets destroyed and hence prevents potential memory leaks.
-  In reading-list.actions.ts, the actions failedRemoveFromReadingList, confirmedRemoveFromReadingList, failedAddToReadingList & confirmedAddToReadingList have no implementation either in Reducer or Effects.  It should be better to add implementation or remove the unwanted codes.
- In books.effects.spec.ts, the test case description is not properly defined.
- In books.selectors.spec.ts, Variable 'state' implicitly has an 'any' type, but better we must specify its correct datatype.
   
# Improvements:

-  Variable names should be more meaningful. (Fixed)
     e.g.: 'term' variable in SearchForm & Search parameter of book search component should be more descriptive. Instead of that we can use it as searchTerm for better understandability.
-  Id in Book state & bookId in readingBookList fields accessing the same value. It is better to replace with one field for making code simpler & avoid confusions.
-  In Book search component, we can separate listing of books & search containers as separate components for good modular structure & reuse. 
-  We can use caching mechanism to avoid multiple search dispatch call.
-  For server API calls, we can use loader for better user experience.
-  As a development perspective, need to ensure that web pages should flow RWD design. Pages are breaking in mobile portrait mode.
-  Hardcoded values can put in constants file.
-  Appropriate error messages should be displayed to user in case of API failure.
-  To clear search results, clear button can be added to improve UX.

# Accessibility issues found in the lighthouse automated scan:

-  Low contrast color for the header (Reading List) & static 'Try searching for a topic, for example "JavaScript". It is difficult to read these texts. (Fixed)
-  Associated labels are not added for the custom interactive controls. (Fixed)

# Accessibility issues not found in the automated scan:

-  Logical tab order is not implemented. (Fixed)
-  A visual distinguishable between interactive (links and buttons) & non-interactive elements on selecting is not implemented. (Fixed)
-  Keyboard focusable & focus indicator for Custom interactive (links and buttons) controls are not implemented. (Fixed)
-  Associated labels (aria-label or aria-labelledby) are not added for some of the custom interactive elements in app component & book search component. (Fixed)
-  `alt` attribute to `img` tags is missing, as it specifies an alternate text for image in case the image is not loaded. (Fixed)
-  Anchor tag is usually used for navigation to different page. Instead, we can use button or span with role="button". (Fixed)
-  Section tag can be used instead of div for grouping related elements together. (Fixed)
