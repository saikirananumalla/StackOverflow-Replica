### The following features were implemented:

1. Comments: User can add his comment on any existing question or answer.
2. Voting: User can upvote or down vote a question, answer or a comment. User can do the same action twice.
3. User profile: Users can signup and view their profiles which includes a logout button.
4. User login: user can login using their registered username and password.
5. Moderate posts: moderators with role as 'mod' can delete any question, answer or comments and only they get a delete button.
6. Included JSDocs
7. Included rate limiting to prevent DDoS attacks.
8. Include hyperlink validation while adding a question, answer and a comment.
9. Included logging of API operations to maintain structured logging.
10. Used material UI for improved UX.
11. Used session authentication middleware combined with CSRF token validation for additional
security layer to prevent XSS attacks.
12. Added Design patterns like strategy wherever needed to improve extensibility. 
13. We also included custom pre-hooks to handle correct deletion of questions, and comments.
14. No ESLint errors or warnings.
15. All core business logic, REST endpoints, request validation, and error scenarios have been rigorously tested
using approximately 80 Jest tests.
16. The application deployed to render and mongo DB hosted on Atlas and all features are working 
as expected.
17. GitHub actions have been added to run Unit tests, esLint analysis and re-populating up the DB at various steps to maintain Continuous Integration.
18. BDD tests added to cover every acceptance scenario in the User stories.
19. Fixed codeQL vulnerabilities for SQL Injection and other suggested changes.
