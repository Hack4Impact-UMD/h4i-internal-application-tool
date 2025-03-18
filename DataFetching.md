# Data Fetching

Traditional methods of fetching data in react components using `useEffect` are prone to mistakes and bugs. 
The [React/Tanstack Query](https://tanstack.com/query/latest) library simplifies data fetching in react
components by handling things like loading and error states, automatic retries, invalidation, and caching
for you. **Whenever you need to fetch data in a component you're writing, try to use Tanstack Query as much
as possible unless you need some custom logic that can not be achieved with the library (this will be very
rare).**

> [!Note]
> This doc provides a simple overview of Tanstack Query to help you get started, but you should consult
the actual Tanstack Query documentation for more detailed information and examples.

## An example

Let's say you need to display a list of applicants in a component. We already have a `getAllApplicants` function,
so creating the corresponding Tanstack Query code for this is pretty simple:

```typescript
const {data, isLoading, isError} = useQuery<UserProfile[]>({
  queryKey: ["applicants"],
  queryFn: getAllApplicants
})
```

`useQuery` will be the main hook you'll use from the Tanstack Query library. It's two main parameters will be the
`queryKey` and the `queryFn`. The query key is a unique list of strings that identifies the data associated with this
query. The library uses this internally to cache the data that was fetched in order to prevent unnecessary requests
in the future. As a result, it's important that you pick the query key carefully and ensure that it uniquely identifies
the data that you are fetching. If you use a query key for another existing query, it's possible that Tanstack Query will
pull data from cache that is completely different from what you're trying to fetch. In the above example, we only have one
query key to identify this query, but some queries will have adiditional keys to encode different parameters of the query.
For example, say we're creating a query to fetch a specific user profile based on the user ID:

```typescript
const {data, isLoading, isError} = useQuery<UserProfile>({
  queryKey: ["profile", uid],
  queryFn: async () => {
    return await getUserById(uid)
  }
})
```

Notice how the `queryKey` array has two members, the first one "profile" denotes that this is a profile query. The second one
passes in the UID for this specific profile query. This ensures that calling this query multiple times but for different user IDs
doesn't result in the cache for one profile query being used for another query for a different user.

The `useQuery` hook returns multiple pieces of data at once. Usually, the one's you'll be most concerned about are `data` which is
the result of the query function (the actual data you're fetching), `isLoading` which is a boolean that indicates whether the query
is still loading, and `isError` which is a boolean that indicates whether the query experienced an error (the error itself can be 
found in the `error` property). 

Now, it's likely that we'll use queries in multiple different components. In this case, it's best to wrap these `useQuery` calls
in our own hooks with more descriptive names:

```ts
export function useApplicants() {
  return useQuery<UserProfile[]>({
    queryKey: ["applicants"],
    queryFn: getAllApplicants
  })
}
```

We can now use our new hook in a component:

```tsx
import { useApplicants } from "../../hooks/useApplicants";

export default function AdminPlaceholderPage() {
  const { data: applicants, isLoading, error } = useApplicants()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return <div className="p-4">
    <h1>All Applicants: </h1>
    <ul>
      {applicants?.map(applicant => <li key={applicant.id}>{applicant.firstName} (ID: {applicant.id})</li>)}
    </ul>
  </div>
}
```

Using the `isLoading` and `error` state that our custom query hook returns, we first check if
our data is still loading and render a loading indicator if so:

![Screenshot From 2025-03-18 02-48-26](https://github.com/user-attachments/assets/e1e6284f-eba1-42e1-8442-e1a11d1b8a31)

If it's not loading, we then check if an error occurred during our query and render an error message if that's the case.
Finally, if our query is no longer loading and hasn't experienced an error, we know that we've received our data and so we render
our actual component content using the new data we received:

![Screenshot From 2025-03-18 02-45-17](https://github.com/user-attachments/assets/2d69198d-6e4c-4e49-99bb-c31d9daf7415)

As you can see, Tanstack Query significantly simplifies your data fetching code allowing you to write more concise and 
readable components.

# Modifying Data with Mutations

TODO
