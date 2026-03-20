# Task Dashboard

A modern, production-ready task dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Recharts**.

## Features

✨ **Modern Dashboard UI**
- Dark theme with responsive design
- Clean, organized layout optimized for all screen sizes
- Professional-grade styling with Tailwind CSS

📊 **4 Stat Cards**
- Total Tasks count
- Completion Percentage
- Average Completion Time (in days)
- Total Photo Count

📈 **4 Interactive Charts** (Recharts)
- **Pie Chart**: Task Status Distribution (Pending, In Progress, Completed)
- **Bar Chart**: Tasks by Priority (Low, Medium, High)
- **Line Chart**: Tasks Created vs Completed Over Time
- **Area Chart**: Cumulative Tasks Growth

📋 **Advanced Task Table**
- Display all tasks with comprehensive details
- **Sorting**: Sort by title, date, status, or priority
- **Filtering**: Filter by status and priority using dropdowns
- **Search**: Real-time search by title or description
- **Pagination**: 10 tasks per page with navigation controls
- **Status & Priority Badges**: Color-coded for quick recognition

⚡ **Performance**
- Responsive, optimized components
- Client-side data processing
- Smooth animations and transitions
- Loading and error states

🎨 **Client-Presentable Design**
- Professional dark theme with accent colors
- Consistent spacing and typography
- Effective use of colors and icons
- Accessibility-focused

## Tech Stack

- **React 19** - UI framework
- **Vite 8** - Fast build tool
- **Tailwind CSS 4** - Utility-first CSS
- **Recharts** - Chart library
- **Day.js** - Date handling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── StatCards.jsx   # 4 stat cards
│   └── TaskTable.jsx   # Advanced table with filtering/sorting
├── pages/              # Page-level components
│   └── Dashboard.jsx   # Main dashboard layout
├── charts/             # Chart components
│   ├── StatusPieChart.jsx           # Status distribution
│   ├── PriorityBarChart.jsx         # Priority breakdown
│   ├── TasksOverTimeChart.jsx       # Created vs completed timeline
│   └── CumulativeTasksAreaChart.jsx # Cumulative growth
├── services/           # API and data services
│   └── taskService.js  # Task operations (filter, search, sort)
├── utils/             # Utility functions
│   └── dataProcessing.js # Stats calculation and data transformation
├── hooks/             # Custom React hooks
│   └── useTasks.js    # Task data fetching hook
├── App.jsx            # Main app component
└── index.css          # Tailwind CSS imports
```

## Data Source

**Sample Task Data**: `public/data/tasks.json`

Each task object contains:
```json
{
  "id": "task-1",
  "title": "Task title",
  "description": "Task description",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high",
  "createdAt": "2024-02-01T09:00:00Z",
  "completedAt": "2024-02-08T17:00:00Z",
  "photos": 12
}
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install required packages (if not already done)
npm install recharts axios dayjs
```

### Running Locally

```bash
# Start development server
npm run dev
```

The app will open at `http://localhost:5174` (or next available port)

### Building for Production

```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

## Usage

### Stats Section
- View key metrics at a glance
- Real-time calculation from task data

### Charts Section
- **Pie Chart**: Hover to see individual counts
- **Bar Chart**: Compare task priorities
- **Line Chart**: Track daily created vs completed tasks
- **Area Chart**: Visualize cumulative growth over time

### Task Table
- **Search**: Type in the search box to filter by title/description
- **Filter by Status**: Select from dropdown (Pending, In Progress, Completed)
- **Filter by Priority**: Select from dropdown (Low, Medium, High)
- **Sort**: Click column headers to sort (Title, Status, Priority, Created Date)
- **Paginate**: Navigate through pages at the bottom

## Customization

### Dark/Light Theme
- Currently configured for dark theme only
- Colors can be adjusted in Tailwind utility classes

### Chart Colors
Edit chart files in `src/charts/` to customize colors:
```jsx
const COLORS = ['#ef4444', '#f59e0b', '#10b981']
```

### Card Layout
Adjust grid columns in `src/components/StatCards.jsx`:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

## Sample Data

The dashboard includes 20 sample tasks covering various statuses, priorities, and dates for realistic visualization.

## Performance Notes

- Data is loaded once on component mount
- All filtering, sorting, and searching is handled client-side
- Charts update responsively when data changes
- Pagination optimizes table rendering for large datasets

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
