# 100DayHabitat - 100 Day Challenge Tracker

A full-stack habit tracking application designed to help users complete 100-day challenges with daily progress tracking, motivational features, and cross-platform support.

## 🎯 Overview

**100DayHabitat** is a comprehensive challenge tracking system that allows users to create personal 100-day goals, track daily progress, maintain streaks, and celebrate milestones. The application features a modern Angular frontend with Capacitor for mobile deployment and an ASP.NET Core backend with JWT authentication.

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **Angular 20.3.3** - Modern standalone component architecture
- **Capacitor** - Cross-platform mobile deployment (Android/iOS)
- **TailwindCSS** - Utility-first styling
- **RxJS** - Reactive state management
- **canvas-confetti** - Celebration animations

**Backend:**
- **ASP.NET Core 9.0** - REST API
- **Entity Framework Core 9.0** - ORM with SQL Server
- **ASP.NET Core Identity** - Authentication & user management
- **JWT Bearer Tokens** - Stateless authentication
- **AutoMapper** - Object-to-object mapping

### Project Structure

```
100DayHabitat/
├── ClientApp/              # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Services, guards, interceptors
│   │   │   ├── features/   # Feature modules (auth, challenges, dashboard, profile)
│   │   │   ├── shared/     # Shared components (navbar, etc.)
│   │   │   └── app.routes.ts
│   │   └── environments/   # Environment configurations
│   ├── android/            # Capacitor Android project
│   └── capacitor.config.ts
├── API/                    # ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── ChallengeController.cs
│   ├── Middleware/
│   │   └── ExceptionMiddleware.cs
│   └── Program.cs
├── Core/                   # Domain entities
│   └── Entities/
│       ├── ApplicationUser.cs
│       ├── Challenge.cs
│       └── ChallengeDay.cs
├── Infrastructure/         # Data access layer
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Repositories/
│   └── Migrations/
└── Service/                # Business logic layer
    ├── Implementations/
    ├── Interfaces/
    ├── DTOs/
    └── Mappings/
```

## 🚀 Features

### User Management
- **Registration & Login** - Secure user authentication with JWT tokens
- **Profile Management** - Update personal information and avatar
- **Password Management** - Change password functionality

### Challenge Management
- **Create Challenges** - Define 100-day goals with titles, descriptions, and start dates
- **View All Challenges** - Dashboard view of all user challenges
- **Challenge Details** - Day-by-day progress calendar view
- **Edit Challenges** - Update challenge information
- **Delete Challenges** - Remove completed or abandoned challenges

### Daily Progress Tracking
- **Day Status** - Mark days as:
  - ✅ Completed
  - ⏭️ Skipped
  - ⏸️ Pending
- **Notes** - Add daily reflections and notes
- **Today Highlighting** - Visual indicator for current day
- **Progress Statistics**:
  - Total days completed
  - Current streak calculation
  - Completion percentage

### Motivational Features
- **Confetti Celebration** - Animated celebration on 100% completion
- **Inspirational Quotes** - Random motivational quotes on challenge completion
- **Visual Progress** - Color-coded calendar showing daily status

## 📊 Database Schema

### Tables

**AspNetUsers** (Identity)
- Id (PK)
- UserName
- Email
- PasswordHash
- FullName
- Avatar
- Phone, EmailConfirmed, etc.

**Challenges**
- Id (PK)
- UserId (FK → AspNetUsers)
- Title
- GoalDescription
- StartDate
- EndDate
- Notes
- CreatedAt
- UpdatedAt

**ChallengeDays**
- Id (PK)
- ChallengeId (FK → Challenges)
- DayNumber (1-100)
- Date
- Status (enum: Pending=0, Completed=1, Skipped=2)
- Note
- CompletedAt
- CreatedAt
- UpdatedAt
- Unique constraint on (ChallengeId, DayNumber)

## 🔧 Setup & Installation

### Prerequisites
- **.NET 9.0 SDK**
- **Node.js 18+** and npm
- **SQL Server** (LocalDB or full instance)
- **Angular CLI** (`npm install -g @angular/cli`)
- **Capacitor CLI** (for mobile builds)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MustafaElsayed74/100DayChallenge.git
   cd 100DayChallenge
   ```

2. **Update connection string**
   
   Edit `API/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HundredDayChallenge;Trusted_Connection=true;"
     },
     "Jwt": {
       "Key": "your_super_secret_jwt_key_min_32_chars",
       "Issuer": "100DayHabitat",
       "Audience": "100DayHabitat"
     }
   }
   ```

3. **Apply migrations**
   ```bash
   cd API
   dotnet ef database update --project ../Infrastructure
   ```

4. **Run the API**
   ```bash
   dotnet run
   ```
   API will be available at `https://localhost:7000` (or configured port)

### Frontend Setup

1. **Navigate to ClientApp**
   ```bash
   cd ClientApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update environment configuration**
   
   Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:7000/api'  // Your API URL
   };
   ```

4. **Run development server**
   ```bash
   ng serve
   ```
   App will be available at `http://localhost:4200`

### Mobile Build (Android)

1. **Build Angular app**
   ```bash
   ng build
   ```

2. **Sync Capacitor**
   ```bash
   npx cap sync android
   ```

3. **Open Android Studio**
   ```bash
   npx cap open android
   ```

4. **Run on device/emulator** from Android Studio

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login and receive JWT
GET    /api/auth/me           - Get current user profile (Auth required)
PUT    /api/auth/me           - Update profile (Auth required)
PUT    /api/auth/password     - Change password (Auth required)
```

### Challenges
```
POST   /api/challenge                - Create new challenge (Auth required)
GET    /api/challenge                - Get all user challenges (Auth required)
GET    /api/challenge/{id}           - Get challenge details (Auth required)
PUT    /api/challenge/{id}           - Update challenge (Auth required)
DELETE /api/challenge/{id}           - Delete challenge (Auth required)
GET    /api/challenge/{id}/days      - Get all days for challenge (Auth required)
PATCH  /api/challenge/{id}/days/{dayNumber} - Update day status (Auth required)
```

### Request/Response Examples

**Register:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

**Create Challenge:**
```json
POST /api/challenge
Authorization: Bearer {token}
{
  "title": "Daily Coding Practice",
  "goalDescription": "Code for 1 hour every day",
  "startDate": "2026-02-05T00:00:00",
  "notes": "Focus on algorithms"
}
```

## 🎨 Frontend Components

### Key Components

**Dashboard (ChallengeListComponent)**
- Display all user challenges
- Create new challenge button
- Challenge cards with progress indicators

**Challenge Detail (ChallengeDetailComponent)**
- 100-day calendar grid
- Day status indicators (color-coded)
- Click day to update status/notes
- Statistics: completed days, current streak
- Celebration modal on completion

**Challenge Create/Edit**
- Form validation
- Date pickers
- Rich text notes

**Profile Management**
- Update user information
- Change password
- Avatar upload (planned)

### Services

**AuthService** - Authentication state management, token handling  
**ChallengeService** - CRUD operations for challenges and days  
**ConfettiService** - Celebration animations  
**AuthGuard** - Route protection  
**AuthInterceptor** - Automatic JWT token injection

## 🔐 Security Features

- **JWT Bearer Authentication** - Stateless, secure token-based auth
- **Password Hashing** - ASP.NET Core Identity with bcrypt
- **CORS Configuration** - Configured for mobile and web clients
- **Authorization Guards** - Protected routes and API endpoints
- **Exception Middleware** - Global error handling with safe error messages

## 📱 Mobile Features

- **Capacitor Integration** - Native mobile app capabilities
- **Responsive Design** - Mobile-first TailwindCSS layouts
- **Offline-Ready** (planned) - Service workers for offline functionality
- **Push Notifications** (planned) - Daily reminders

## 🧪 Testing

### Run Backend Tests
```bash
cd API
dotnet test
```

### Run Frontend Tests
```bash
cd ClientApp
ng test        # Unit tests (Karma)
ng e2e         # End-to-end tests
```

## 🚧 Known Issues & Future Enhancements

### Current Limitations
- Avatar upload functionality incomplete
- No email verification
- Limited test coverage

### Planned Features
- 📧 Email notifications and reminders
- 📊 Advanced analytics and charts
- 🏆 Achievements and badges
- 👥 Social sharing and friend challenges
- 🌙 Dark mode
- 🌐 Multi-language support
- 📴 Full offline support with sync

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Mustafa Elsayed**
- GitHub: [@MustafaElsayed74](https://github.com/MustafaElsayed74)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email mustafa.elsayed@example.com or open an issue on GitHub.

---

**Built with ❤️ to help you build better habits, one day at a time.**