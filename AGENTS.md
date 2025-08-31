# Schoolwork Tracker

A Firebase-powered schoolwork tracking application built with Next.js, TypeScript, and Tailwind CSS. Students can manage assignments, track due dates, set priorities, and filter by course - all synced in real-time across devices.

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Backend**: Firebase Firestore for real-time data synchronization
- **UI**: Radix UI components + Lucide React icons
- **Styling**: Tailwind CSS with custom design system

## Key Features

### Assignment Management
- Add, edit, and delete assignments with title, course, description, due date, and priority
- Mark assignments as complete/incomplete
- Real-time synchronization across all devices using Firebase Firestore

### Smart Organization
- Filter assignments by course (30+ courses supported)
- Toggle visibility of completed assignments
- Priority levels: Low, Medium, High with color-coded badges
- Due date tracking with urgency indicators (Overdue, Due Today, Due Soon)

### Course Support
Supports all major high school courses including:
- Core subjects: English, Math, Science, History
- Languages: Spanish, French
- Electives: Art, Theatre, Band, Computer Science, Psychology
- And many more...

## Project Structure

\`\`\`
app/                     # Next.js app directory
├── page.tsx            # Main schoolwork tracker component
├── layout.tsx          # Root layout with fonts and providers
└── globals.css         # Tailwind CSS styles

components/ui/          # Reusable UI components
├── button.tsx         # Button component
├── card.tsx           # Card layouts
├── dialog.tsx         # Modal dialogs
├── select.tsx         # Dropdown selects
└── ...                # Other UI components

lib/
└── firebase.ts        # Firebase configuration and initialization
\`\`\`

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

## Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Set up Firestore security rules for the `assignments` collection
4. Copy your Firebase config to the environment variables

## Development

\`\`\`bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
\`\`\`

## Features in Detail

### Real-time Synchronization
- All assignment changes sync instantly across devices
- Uses Firebase Firestore's real-time listeners
- Offline support with automatic sync when reconnected

### Smart Filtering
- Course-based filtering with 30+ supported courses
- Show/hide completed assignments
- Assignments sorted by due date (earliest first)

### Visual Indicators
- Priority badges: Green (Low), Yellow (Medium), Red (High)
- Urgency badges: Red (Overdue), Orange (Due Today), Yellow (Due Tomorrow), Blue (Due Soon)
- Completion status with strikethrough text for completed items

### Responsive Design
- Mobile-first design approach
- Card-based layout that works on all screen sizes
- Touch-friendly interface for mobile devices

## Data Model

### Assignment Interface
\`\`\`typescript
interface Assignment {
  id: string
  title: string
  course: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: string
}
\`\`\`

## Deployment

This app is designed to work with Vercel's deployment platform:

1. Connect your GitHub repository to Vercel
2. Add your Firebase environment variables in Vercel's dashboard
3. Deploy automatically on every push to main branch

The app uses Next.js 14 with the App Router and is fully compatible with Vercel's edge runtime.
