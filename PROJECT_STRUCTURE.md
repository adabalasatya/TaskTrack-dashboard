# Project Structure

```
tasktrack-dashboard/
├── public/
│   └── data/
│       └── tasks.json              # Sample task data (20 realistic tasks)
│
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── index.js               # Component exports
│   │   ├── StatCards.jsx          # 4 stat cards (Total, %, Avg Time, Photos)
│   │   └── TaskTable.jsx          # Advanced table with sorting/filtering
│   │
│   ├── pages/                      # Page-level components
│   │   └── Dashboard.jsx          # Main dashboard layout
│   │
│   ├── charts/                     # Recharts components
│   │   ├── index.js               # Chart exports
│   │   ├── StatusPieChart.jsx     # Pie chart - Status distribution
│   │   ├── PriorityBarChart.jsx   # Bar chart - Priority breakdown
│   │   ├── TasksOverTimeChart.jsx # Line chart - Created vs Completed
│   │   └── CumulativeTasksAreaChart.jsx  # Area chart - Cumulative growth
│   │
│   ├── services/                   # API and data services
│   │   └── taskService.js         # Task operations (filter, search, sort)
│   │
│   ├── utils/                      # Utility functions
│   │   ├── dataProcessing.js      # Stats calculation & transformations
│   │   └── exportUtils.js         # CSV export functionality
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── useTasks.js            # Hook for fetching tasks with loading/error
│   │
│   ├── App.jsx                     # Main app component (imports Dashboard)
│   ├── main.jsx                    # React DOM render
│   └── index.css                   # Tailwind CSS imports
│
├── index.html                      # Entry HTML
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── eslint.config.js                # ESLint configuration
├── package.json                    # Dependencies and scripts
│
├── DASHBOARD_README.md             # Complete documentation
├── QUICK_START.md                  # Quick start guide
└── PROJECT_STRUCTURE.md            # This file

```

## Component Relationships

```
App
└── Dashboard
    ├── StatCards
    │   └── StatCard (4 instances)
    │
    ├── StatusPieChart
    ├── PriorityBarChart
    ├── TasksOverTimeChart
    ├── CumulativeTasksAreaChart
    │
    └── TaskTable
        ├── Search Input
        ├── Status Filter
        ├── Priority Filter
        ├── Table
        ├── Pagination Controls
        └── Export Button
```

## Data Flow

```
[tasks.json] 
    ↓
[useTasks hook] → Fetch & Load
    ↓
[Dashboard]
    ├─→ getAllStats() → [StatCards]
    │
    ├─→ getStatusDistribution() → [StatusPieChart]
    │
    ├─→ getPriorityDistribution() → [PriorityBarChart]
    │
    ├─→ getTasksOverTime() → [TasksOverTimeChart]
    │
    ├─→ getCumulativeTasks() → [CumulativeTasksAreaChart]
    │
    └─→ [TaskService Operations] → [TaskTable]
        ├─ Filter by Status
        ├─ Filter by Priority
        ├─ Search by Title/Description
        ├─ Sort (multiple fields)
        └─ Paginate (10 items/page)
```

## Key Features by File

| File | Features |
|------|----------|
| `StatCards.jsx` | 4 metric cards with icons |
| `StatusPieChart.jsx` | Interactive pie chart with legend |
| `PriorityBarChart.jsx` | Bar chart with custom colors |
| `TasksOverTimeChart.jsx` | Dual-line chart for trends |
| `CumulativeTasksAreaChart.jsx` | Area chart with gradient |
| `TaskTable.jsx` | Search, Filter, Sort, Paginate, Export |
| `dataProcessing.js` | 10+ utility functions for calculations |
| `taskService.js` | Filter, search, sort operations |
| `useTasks.js` | Loading & error state management |
| `exportUtils.js` | CSV export functionality |

## Dependencies

### Core
- **react**: UI framework
- **react-dom**: DOM rendering

### Styling
- **tailwindcss**: Utility-first CSS
- **autoprefixer**: CSS vendor prefixes

### Charts & Data
- **recharts**: Chart library
- **dayjs**: Date manipulation
- **axios**: HTTP client

### Icons
- **lucide-react**: Modern icon set

### Development
- **vite**: Build tool
- **@vitejs/plugin-react**: React support for Vite
- **eslint**: JavaScript linting

---

**Total Components**: 8 major components
**Total Utilities**: 10+ functions
**Total Custom Hooks**: 1
**Total Services**: 1
**Sample Data**: 20 tasks
