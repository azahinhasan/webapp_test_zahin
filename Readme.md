## Appeal Points

- Successfully implemented both backend and client features with a strong focus on functionality and separation of concerns.
- Maintained a clean, modular, and scalable code structure for both frontend and backend.
- Followed proper Git workflow: `main`, `develop`, and feature branches with regular pull requests and clean commit history.
- A Postman backup file is provided at `webapp/server/postman_backup`.  
  - **Note:** To use the API in Postman:
    - First run `/auth/csrf-token` to generate and store the CSRF token.
    - Then log in via `/auth/login`. The token and CSRF will be set automatically in Postman environment variables.


## Implemented Features

### Signup & Login
- Users can sign up with a unique email and a password (minimum 6 characters).
- After login, a token containing the user ID and email is stored in cookies.
- Authentication is handled using JWT.

### Timeline
- The Timeline page displays all murmurs posted by users the current user follows, along with their details and like counts.
- Includes pagination and allows users to like or unlike any murmur.
- Each murmur card includes the poster's name — clicking it navigates to their profile.
- Long murmurs are truncated but can view the full text by clicking View Details.
- Users can post new murmurs directly from the timeline page.

### People
- Discover all other users on the platform.
- Follow or unfollow users directly from the list.
- Click on a user’s name to view their profile.

### Other User Profile
- Displays all murmurs posted by the selected user.
- Shows follower and following counts, with full lists.
- Logged-in users can follow or unfollow the user directly from their profile.
- In the followers/following lists, the logged-in user can also follow/unfollow others (except themselves).

### My Profile
- Shows user’s own details, follower/following counts, and lists.
- Users can unfollow someone with an option to undo the action for a short time.
- Displays the user’s own murmurs, and they can delete their murmurs.

### Logout
- Clears all stored tokens and logs the user out securely.

### Security & Utilities
- CSRF token is automatically stored when visiting the page and used for secure requests.
- Rate limiter (Throttler) implemented to prevent excessive API calls.
- Includes logging and response interceptors for better debugging and tracking.
- Proper validation is implemented with DTOs.
- API versioning and more.

### Backend Folder Structure (NestJS)
```
server/
├─ postman_backup/
│  └─ webapp-test.postman_collection.json
├─ src/
│  ├─ app/
│  │  ├─ auth/
│  │  │  ├─ dto/
│  │  │  │  ├─ login.dto.ts
│  │  │  │  └─ signup.dto.ts
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  └─ auth.service.ts
│  │  ├─ murmur/
│  │  │  ├─ dto/
│  │  │  │  └─ murmur.dto.ts
│  │  │  ├─ murmur.controller.ts
│  │  │  ├─ murmur.module.ts
│  │  │  └─ murmur.service.ts
│  │  ├─ user/
│  │  │  ├─ dto/
│  │  │  │  └─ user.dto.ts
│  │  │  ├─ user.controller.ts
│  │  │  ├─ user.module.ts
│  │  │  └─ user.service.ts
│  │  └─ index.ts
│  ├─ common/
│  │  ├─ decorators/
│  │  │  └─ get-issuer.decorator.ts
│  │  ├─ dtos/
│  │  │  ├─ index.dto.ts
│  │  │  └─ pagination.dto.ts
│  │  ├─ interceptor/
│  │  │  ├─ logging-monitoring.interceptor.ts
│  │  │  └─ response-message.interceptor.ts
│  │  └─ types/
│  │     └─ express.d.ts
│  ├─ config/
│  │  └─ configuration.ts
│  ├─ entities/
│  │  ├─ follow.entity.ts
│  │  ├─ index.ts
│  │  ├─ like.entity.ts
│  │  ├─ murmur.entity.ts
│  │  ├─ user.entity.js
│  │  └─ user.entity.ts
│  ├─ guards/
│  │  └─ auth-guard.ts
│  ├─ app.controller.js
│  ├─ app.controller.ts
│  ├─ app.module.js
│  ├─ app.module.ts
│  ├─ app.service.js
│  ├─ app.service.ts
│  ├─ main.js
│  └─ main.ts
├─ .gitignore
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ tsconfig.json
└─ yarn.lock

```

---

### Frontend Folder Structure (React)

```
src/
├─ components/
│  ├─ MurmurCard.tsx
│  ├─ MurmurList.tsx
│  └─ NavBar.tsx
├─ pages/
│  ├─ loginPage.tsx
│  ├─ murmurDetailPage.tsx
│  ├─ otherUserPage.tsx
│  ├─ peoplePage.tsx
│  ├─ profilePage.tsx
│  ├─ signupPage.tsx
│  └─ timelinePage.tsx
├─ utils/
│  ├─ api.ts
│  └─ interfaces.ts
├─ .babelrc
├─ .editorconfig
├─ .eslintrc.js
├─ .gitignore
├─ .prettierrc
├─ App.tsx
├─ index.css
├─ index.html
├─ jest.config.js
├─ main.tsx
├─ package-lock.json
├─ package.json
├─ README.md
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ yarn.lock
```

## Unimplemented Features
- N/A (All required features implemented)

## Impressions
- This assignment provided a great opportunity to work on a full-stack application using modern technologies like NestJS and React, enhancing my experience with REST API design and integration.
- Setting up the development environment independently and resolving runtime issues helped strengthen my problem-solving and debugging skills.
