# H4I-UMD App Portal Release

## Intro

This document's purpose is to track the process of finishing, testing, and deploying the H4I-UMD App Portal in time for the Fall 2025 semester. This was initially planned for August 1, 2025, but will come sometime later. Last year, the application form was released on August 13, 2024, and a similar timeline is desirable.

The application has three tiers of Permissions, with the majority of app screens locked to one of the following:

- Applicants
- Reviewers
- Super Reviewer (aka, Director of Recruitment or DOR)

There are small screens missing for Applicant and Super Reviewer, but Reviewer functionality is the most unfinished thus far. Most importantly, we are missing Express routes and React logic for a Reviewer or Interviewer to send a score and notes for applicants.

## Completion Status

See `README.md` for some screenshots of app progress. Also, try running the app.

### All Roles

| Feature/Story              | Status | Notes                               |
| -------------------------- | ------ | ----------------------------------- |
| Log-in/Sign-Up Page        | ✅     |                                     |
| Profile/Settings Page      | ❌     | Design submitted recently           |
| Report an Issue            | ✅     | currently just a link to club email |
| Error/404 Page             | ✅     |                                     |
| Forgot/Reset Password Page | ✅     | Done                                |

### Applicant

| Feature/Story                  | Status | Notes                                                                  |
| ------------------------------ | ------ | ---------------------------------------------------------------------- |
| Overview Page                  | ✅     |                                                                        |
| Application Page               | ✅     | need to look at Fall 25 application and see if we're missing features. |
| Review/Submit Application Page | ✅     |                                                                        |
| Application Submitted Page     | ✅     |                                                                        |
| Status Page                    | ✅     |                                                                        |
| Revisit Application Page       | ✅     |                                                                        |
| Decision Page                  | ❌     | Design submitted recently                                              |

### Reviewer

| Feature/Story                 | Status | Notes                                                                         |
| ----------------------------- | ------ | ----------------------------------------------------------------------------- |
| Overview Page                 | ✅     |                                                                               |
| Assigned Reviews Dashboard    | ✅     |                                                                               |
| Assigned Interviews Dashboard | ✅     |                                                                               |
| Submit Review Page            | ❌     | Has a non-functional and sketchy frontend                                     |
| Submit Interview Page         | ❌     | Not started. This is simpler than submitting reviews, so this should be first |

### Super Reviewer

| Feature/Story                         | Status | Notes                                                     |
| ------------------------------------- | ------ | --------------------------------------------------------- |
| Overview Page                         | ✅     |                                                           |
| User Management Dashboard             | ✅     |                                                           |
| All Applications Dashboard            | ✅     |                                                           |
| - Reviewer Assignment                 | ✅     |                                                           |
| Qualified Dashboard                   | ✅     | Done                                                      |
| - Interview Assignment                | ✅     | see above                                                 |
| - Changing Application Decisions      | ✅     | see above                                                 |
| Reviewers Dashboard                   | ✅     | this and Interviewers need an efficiency change           |
| - Role Assignment                     | ✅     |                                                           |
| Interviewers Dashboard                | ✅     |                                                           |
| - Interview Assignment                | ✅     | Done                                                      |
| Reviews for X Application Dashboard   | ✅     |                                                           |
| Applications for X Reviewer Dashboard | ✅     |                                                           |
| View Application Page                 | ✅     |                                                           |
| Form Validation Page                  | ✅     | stretch goal, can just remove or not use if it has issues |

## Deployment Plans

Release timeline would be sped-up if we had a unique URL, and thus do not have to integrate with an existing website, such as `apply.umd.hack4impact.org` or `apply-hack4impact-umd.org`. Currently, if we were to deploy on a route on the existing website, we would need to integrate with the existing website's deployment, update routes in the app to match the new base route, and update links to assets to match the new base route. This also prohibits us from leveraging automatic deployments through github actions, as each deployment would need to be manually integrated with the current site. A separate domain or subdomain would dramatically reduce the time needed to deploy.

## Testing Plans

Deployment will need to be "done" for this. Past that, we will need to plan and gather users for a beta test. The beta testing should mock a full application process, from applicants submitting their applications, to reviews and interviews, and finally decision release.

## Ticket Board

For code contributions only.

See `README.md`, `DataFetching.md`, and `backend/README.md` for information on dev environment setup.

### Required

| Ticket                     | Assignee | Scope  | Notes                                                              |
| -------------------------- | -------- | ------ | ------------------------------------------------------------------ |
| Upload Fall 25 Application |          | Medium | Mostly manual work, but a good opportunity to test the form types. |
| Reviewer/Interview Grading |          | Large  | Most important! Both frontend/backend.                             |
| Profile/Settings Page      |          | Small  | Copy from Figma                                                    |
| Applicant Decision Page    |          | Small  | Copy from Figma                                                    |

### Good to Have + Nitpicks

| Ticket                                        | Assignee | Scope  | Notes                                                                        |
| --------------------------------------------- | -------- | ------ | ---------------------------------------------------------------------------- |
| Finish and use export to CSV button           |          | Small  | only works for current page of the dashboard, only on reviewers/interviewers |
| Interview assignments for Interview dashboard |          | Medium | waiting for the equivalent work in Qualified to be merged                    |
