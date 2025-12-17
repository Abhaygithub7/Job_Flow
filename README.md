# JobFlow 🚀

A premium job application tracker built with React 19, Tailwind CSS, and Gemini AI integration.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5--flash-green)

## Features

### 📊 Dashboard
- Stats cards showing Total Applied, Interviews, Offers, Rejected, Accepted
- 30-day application frequency chart
- Trend indicators for performance tracking

### 💼 Job Tracker
- **My Applications** - Track jobs you've applied to
- **Offers Received** - Manage incoming offers
- Search by company, role, or location
- Filter by status (Applied, Interview, Offer, Rejected, Accepted)
- Full CRUD operations

### 🤖 AI-Powered Features
- **Cover Letter Generator** - Personalized cover letters using your skills
- **Interview Guide Generator** - Comprehensive prep guides for interviews
- Powered by Google's Gemini 2.5 Flash model

### ⚙️ Settings
- Profile configuration (name, skills)
- Gemini API key management
- Data persists in localStorage

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Icons:** Lucide React
- **AI:** @google/genai SDK

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd "Job Tracker"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Configuration

1. Go to **Settings** in the sidebar
2. Enter your **Full Name** and **Skills** (used for AI-generated content)
3. Add your **Gemini API Key**
4. Click **Save Settings**

## Usage

### Adding a Job Application
1. Click **Jobs** in the sidebar
2. Click **Add Application**
3. Fill in company, role, and other details
4. Click **Generate with AI** to create a cover letter
5. Click **Add Job**

### Tracking Offers
1. Switch to **Offers Received** tab
2. Click **Add Offer**
3. Generate an **Interview Guide** for preparation

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── StatsCard.tsx
│   ├── StatusBadge.tsx
│   ├── JobCard.tsx
│   └── JobModal.tsx
├── context/          # React Context for state
│   └── JobContext.tsx
├── pages/            # Main app pages
│   ├── Dashboard.tsx
│   ├── Jobs.tsx
│   └── Settings.tsx
├── services/         # External API services
│   └── gemini.ts
├── types/            # TypeScript definitions
│   └── types.ts
└── App.tsx           # Root component
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## License

MIT

---

Built with ❤️ using React
