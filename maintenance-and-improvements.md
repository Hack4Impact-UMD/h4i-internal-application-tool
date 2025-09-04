##  Some potential improvement ideas

1. Migrate query keys and references to query keys to [query key factory](https://github.com/lukemorales/query-key-factory). This will provide a type-safe way to reference, invalidate, and use queries. The current approach of manually managing query keys is not sustainable.
2. The main application form rendering (and probably other forms like rubrics) should be refactored to use [Tanstack Form](https://tanstack.com/form/latest). The way we manage form/response state currently causes unnecessary re-renders of the whole form and page every time a single question response changes. This will correct that while also providing nicer validation support.
3. ...
