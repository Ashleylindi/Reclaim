src/
│
├── main.ts
├── app.module.ts
│
├── config/
│   ├── env.config.ts
│   ├── app.config.ts
│
├── database/
│   ├── database.module.ts
│   ├── database.provider.ts
│   ├── mongo.constants.ts
│
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── utils/
│
├── modules/
│   │
│   ├── users/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts 
│   │   ├── users.module.ts
│   │
│   ├── auth/
│   │   ├── dto/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │
│   ├── journal/
│   │   ├── dto/
│   │   ├── journal.controller.ts
│   │   ├── journal.service.ts
│   │   ├── journal.repository.ts
│   │   ├── journal.module.ts
│   │
│   ├── mood/
│   │   ├── dto/
│   │   ├── mood.controller.ts
│   │   ├── mood.service.ts
│   │   ├── mood.repository.ts
│   │   ├── mood.module.ts
│   │
│   ├── meetings/
│   │   ├── dto/
│   │   ├── meetings.controller.ts
│   │   ├── meetings.service.ts
│   │   ├── meetings.repository.ts
│   │   ├── meetings.module.ts
│   │
│   └── ai/
│       ├── ai.service.ts
│       ├── ai.controller.ts
│       ├── ai.module.ts
│
└── shared/
    ├── types/
    ├── constants/
    ├── errors/
    └── schemas/ (optional TS-only models)