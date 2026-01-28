# Street League Platform

A comprehensive youth development platform for Street League, connecting to Azure Databricks for data management and analytics.

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Hosting**: Azure Static Web Apps
- **Backend API**: Azure Functions
- **Data**: Azure Databricks SQL Warehouse

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
npm install
npm run dev
```

### Azure Deployment

See [Azure Deployment Guide](docs/AZURE_DEPLOYMENT.md) for full deployment instructions.

## Project Structure

```
├── azure-functions/     # Azure Functions for Databricks API
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   └── types/           # TypeScript types
└── docs/                # Documentation
```

## Features

- Dashboard with real-time statistics
- Participant management
- Session scheduling
- Attendance tracking
- Skills assessment
- Analytics and reporting

## Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Azure Static Web Apps
- Azure Functions
- Azure Databricks

## License

Proprietary - Street League
