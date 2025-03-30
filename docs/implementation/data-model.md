# Data model

The data model is defined in prisma language. It is located in the `prisma/schema.prisma` file.
The data model is used to generate the database schema and the Prisma client.
The data model is also used to generate the types for the API.

---

## Data model overview

The data model consists of the following models:

- `User`: Represents a user in the system.
- `Team`: Represents a team in the system.
- `Task`: Represents a task in the system.

There are also some tables that are used for the authentication and authorization logic:

- `Session`: Represents a session in the system.
- `EmailVerificationRequest`: Represents an email verification request in the system.
- `PasswordResetRequest`: Represents a password reset request in the system.

Lastly, there are some enums that are used to define the possible values for some fields:

- `TaskPriority`: Represents the priority of a task.
- `TaskStatus`: Represents the status of a task.
- `Tag`: Represents tags that can be assigned to tasks.

## Data model details

Represents a user in the system.

This model stores the core user details, including authentication information such as the password hash, email
verification status, and recovery codes.
It also records timestamps for creation and last login.

Relationships:

- A user can have multiple sessions (active logins).
- A user can request multiple email verifications and password resets.
- A user can belong to multiple teams and also be the leader of some teams.
- A user can have multiple tasks assigned.

```prisma
model User {
  id                    Int                        @id @default(autoincrement())
  email                 String                     @unique
  username              String                     
  passwordHash          String                     
  emailVerified         Boolean                    @default(false)
  totpKey               Bytes?                     
  recoveryCode          Bytes                      
  createdAt             DateTime                   @default(now())
  lastLogin             DateTime?                  
  sessions              Session[]                  
  emailVerificationReqs EmailVerificationRequest[] 
  passwordResetSessions PasswordResetSession[]     
  teams                 Team[]                     
  teamsLeader           Team[]                     @relation("TeamLeader")
  tasks                 Task[]                     

  @@index([email])
}
```

---

Represents a team in the system.

This model is used for grouping users to facilitate collaborative work.
Each team has a name, a detailed description, and a creation timestamp.

Relationships:

- Each team has one team leader (a user), indicated by the `teamLeader` relation.
- A team can include multiple users as members.
- A team can have multiple tasks associated with it.

```prisma
model Team {
  id           Int      @id @default(autoincrement())
  name         String   
  description  String   
  createdAt    DateTime @default(now())
  teamLeaderId Int      
  teamLeader   User     @relation("TeamLeader", fields: [teamLeaderId], references: [id])
  users        User[]   
  tasks        Task[]   
}
```

---

Represents a task in the system.

This model defines a unit of work or activity that can be assigned to either an individual user or an entire team.
It includes details such as a title, a short teaser, a full description and a due date.
The task is further characterized by its priority, tags, and status, which help in organizing and tracking progress.

Relationships:

- A task can be optionally assigned to a specific user.
- A task can also be optionally linked to a team.

```prisma
model Task {
  id          Int          @id @default(autoincrement())
  title       String       
  teaser      String       
  description String       
  dueDate     DateTime     
  priority    TaskPriority 
  tags        Tag[]        
  status      TaskStatus   
  userId      Int?         
  teamId      Int?         
  user        User?        @relation(fields: [userId], references: [id])
  team        Team?        @relation(fields: [teamId], references: [id])
}
```

---

Represents a session in the system.

This model is used to track the login sessions of users.
Each session is identified by a unique session ID, and includes an expiration timestamp to determine its validity.
There is also a flag to indicate whether two-factor authentication has been successfully verified for the session.

Relationships:

- Each session is linked to one user.

```prisma
model Session {
  id                String   @id
  userId            Int      
  expiresAt         DateTime 
  twoFactorVerified Boolean  @default(false)
  user              User     @relation(fields: [userId], references: [id])
}
```

---

Represents an email verification request.

This model handles the ongoing email verification processes in the system.
It stores a verification code, the email address to be verified, and an expiration timestamp.

Relationships:

- Each email verification request is linked to one user.

```prisma
model EmailVerificationRequest {
  id        String   @id
  userId    Int      
  email     String   
  code      String   
  expiresAt DateTime 
  user      User     @relation(fields: [userId], references: [id])
}
```

---

Represents a password reset session.

This model is used to manage password reset processes.
It includes a reset code, the email address for which the reset is requested, and an expiration timestamp.
Additional flags are used to track the progress of email and two-factor authentication verifications during the reset
process.

Relationships:

- Each password reset session is linked to one user.

```prisma
model PasswordResetSession {
  id                String   @id
  userId            Int      
  email             String   
  code              String   
  expiresAt         DateTime 
  emailVerified     Boolean  @default(false)
  twoFactorVerified Boolean  @default(false)
  user              User     @relation(fields: [userId], references: [id])
}
```