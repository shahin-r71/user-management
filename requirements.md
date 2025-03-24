# Requirements for task 4.

**Task #4 (ALL GROUPS) **

Use language and platform **FOR YOU GROUP**:

* JavaScript or TypeScript, React, PostgreSQL or MySQL or any database (see below),
* C#, .NET, some kind ASP.NET, SQL Server or any database,

THE FIRST REQIUREMENT: YOU NEED TO CREATE A UNIQUE INDEX IN DATABASE.

THE SECOND REQUIREMENT: YOUR TABLE SHOULD LOOK LIKE TABLE AND YOUR TOOLBAR SHOULD LOOK LIKE TOOLBAR.

THE THIRD REQUIREMENT: DATA IN THE TABLE SHOULD BE SORTED (E.G., BY THE LAST LOGIN TIME).

THE FOURTH REQUIREMENT: MULTIPLE SELECTION SHOULD BE IMPLEMENTED USING CHECKBOXES (SELECT ALL/DELECT ALL IS ALSO A CHECKBOX).

THE FIFTH REQUIREMENT: BEFORE EACH REQUEST EXCEPT FOR REGISTRATION OR LOGIN, SERVER SHOULD CHECK IF USER EXISTS AND ISN'T BLOCKED (if user account is blocked or deleted, any next user’s request should redirect to the login page).

Create a _working and deployed (remotely accessible)_ Web application with user registration and authentication.

Non-authenticated users should not have access to the user management (admin panel). They have only access to login form or registration form.

Only authenticated users should have access the user management **table** with at least the following fields: (selection checkbox), name, e-mail, last login time (or the last “activity” time or both), status (active/blocked). You also may add registration time, some sparkline for activity, etc. (optional).

**The leftmost column** of the table should contains checkboxes without labels for multiple selection (table header contains _only checkbox without label that selects or deselects all the records_).

There must be a **toolbar** over the table with the following actions: Block (button with text), Unblock (icon), Delete (icon). NO BUTTONS IN EACH ROW.

You have to use any **CSS framework** (Bootstrap is recommended, but you can choose any CSS framework).

All users should be able to block or delete _themselves_ or any other user.

**User can use any non-empty password (even one character).**

No e-mail confirmation should be required.

Blocked user should not be able to login, deleted user can re-register.

JUST IN CASE: YOU HAVE TO CREATE A UNIQUE INDEX IN THE DATABASE. NOT TO CHECK WITH YOU CODE FOR UNIQUENESS, BUT CREATE THE INDEX.

YOU STORAGE SHOULD GUARANTEE ***E-MAIL*** UNIQUENESS INDEPENDENTLY OF HOW MANY SOURCES PUSH DATA INTO IT SIMULTANEOUSLY.

Note that a _unique index_ is not the same as a _primary key_ (which you should have too):
[https://en.wikipedia.org/wiki/Database_index]()

Generally, you can use any "architecture", either implement a classic Web-application with a server and a database or separate front from back. It's not important in this task. Generally, it's the most simple and straightforward to use a relational DB, e.g. PostgreSQL or MySQL. You can, if you wish, use anything else. E.g., MongoDB, but it really won't give you any advantage in this task (you just deprive yourself a very major skill). But you can. Or you can even try use some SaaS like Firebase. But be careful, you easily will get into some troubles. E.g.,  if you decide to use "out-of-the-box" users, it may be problematic to delete them. If you decide to use custom "users", you may have some problems with maintaining uniquieness of e-mails, etc. I have to remind, that you code can contain only error processing and management of uniqueness have to be performed on the storage level, but you code shouldn't contain checks whether the e-mail already exists. Arguably, the simplest solution is to use a classic boring "trivial" relational database. But even in Firebase you may try to create documents that uses e-mails as keys (again, it limits you ability to change e-mail by user request, etc.).

NO WALLPAPERS UNDER THE TABLE. NO ANIMATIONS. NO BROWSER ALERTS. NO BUTTONS IN THE DATA ROWS.

Your application should work properly in different browsers and on different resolutions (desktop/mobile). However, you have to get that automagically by properly using CSS framework like Bootstrap.

DON'T INVENT ANYTHING, USE LIBRARIES FOR EVERYTHING.

Implement:

1. adequate error messages;
2. tooltips;
3. status messages (informing user about succesful operation).

If you use N buttons (separate set of buttons for each row), the grade will be reduced by 20%. You need to implement selection and a toolbar. And align text properly in the cells (check the screenshot below).

This is table with toolbar (well, you are not required to show sparklines with previous user activity, it's definitely optional):

[![1741852506436](image/requirements/1741852506436.webp)]()

That's not:

![1741852602910](image/requirements/1741852602910.webp)

This is a login form:

![1741852647215](image/requirements/1741852647215.webp)

That's not:

![1741852679260](image/requirements/1741852679260.webp)

**How to submit the solution**
Send to p.lebedev@itransition.com:

* Full name.
* Link to source code.
* _Link to the deployed project_ (you can use any hosting you find suitable — azure, amazon, render, somee, vercel, netlify, _anything_).
* Recorded video: registration, login, non-current user selection, user blocking (the user status should be updated), user unblocking, all user selection (including current), all user blocking (with automatic redirection to the login page), demonstration of the index created in the database (if you use storage that doesn't support indices, demonstrate the solution using  documents with e-mail as keys or some kind of triggers – any solution that will _guarantee_ consitency on the storage level).

PLEASE, MAKE SURE THAT YOUR VIDEO CONTAINS DEMONSTRATION OF THE INDEX IN THE DATABASE AS WELL AS PLACE IN THE CODE THAT CATCHES THE CORRESPONING ERROR AND SHOW AN APPROPRIATE MESSAGE. IF YOU USE SOME STORAGE NOT VERY SUITED FOR THIS TASKS THAT DOESN'T SUPPORT INDICES, DEMONSTRATE YOUR TRIGGERS OR DOCUMENTS THAT USES E-MAILS AS KEYS, ETC. If you ignore this requirement or implement it by checking if e-mail exists in the database by your code, the solution won't be accepted.

**Deadlines for this task 25.03.25.**

Why all users are admins, isn't that strange? Yes, kinda, in reality it won't be implemented this way. But here are two reasons:

1) To simplify testing (for you and for me).
2) To simplify your work, because you don't need to think about user roles (in this task).

However, the admin ability to delete themselves is very real and very ofter required — if you have no idea why, you may ask.

[https://www.w3schools.com/sql/sql_ref_create_unique_index.asp]()

**About #4**

Users shouldn't be "kicked" _right away_. They should be "kicked" when they try to perform some action. For example, if I look at user list while somebody else blocked me (or I block itself from other browser), I can continue to stare at the users list as long as I want. But if I try to block or unblock somebody, I must be redirected to login page with the correspoding notification. You have to check before any server request that user exists and isn't blocked.


Such "db admin" or "back-ender" will write a single line in the migration:

```
CREATE UNIQUE INDEX users_email_uniq ON users (email);
```

And say, "I won't have users with duplicate names ever."

And the work for the "front-end" only begins. Because it's necessary to process different kinds of errors and propose corresponding responses to the user. Here are a few, just as an example: broken back-end server connection, security errors (you have some checks and validations on the client and "front," but you cannot expect the server to agress with everything, right?), "unexpected" internal errors on the back-end side, unique index violation described above (which is not an error; it's an expected situation; you need to show an information message, not an error one), _password policy constraints_, and others. And you can't expect to get a single proper "message" and simply send it back to the user.

I hope you get the idea. You cannot say, "It's not my responsibility to resolve this issue." I understand that some of you dreamt about software development as a job of writing the same line in the same file on project after project, and everything around has to just automagically work. Tough luck. Such positions, if any existed, are being replaced by AI.

You need to create a well-rounded user registration application and understand how it ticks, what results in what, etc. **Of course**, feel free to move more logic to the "back," making more checks and processing there, or you may use a very "slim" rudimentary "back" and do nothing except call the database, or don't use a separate "back" at all, or even call a SaaS to store data. **But make it a working application, not a school homework assignment!** ***If you want to become an engineer, of course.***

And, of course, the most basic thing in any application where multiple users can modify data, ***optimistic locking*** requires collective efforts through all the "levels".

I've simplified some things a bit, as well as exaggerated and overcompicated some things as well (there are ORMs that take care of a lot of stuff, right?). And I repeat again, you will have a narrow specialization on your first real project. But to understand what you need to do and what your part is in it, you need to understand how the simple project works as a whole. You need to create unique indices in the database and you need to display messages on the client side. I again refer to the experience of working with juniors for 20 years; I am sorry for that, but only hard "exercising" _will_ make you engineers.

No pain, no gain.
