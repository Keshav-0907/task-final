## Project Structure

The project consists of two main parts:
- `client/`: Next.js frontend application
- `API/`: Node.js backend application
- `k8s/`: Kubernetes Files

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- kubectl (for Kubernetes deployment)

## Environment Setup

### Frontend (Client)

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

### Backend (API)

1. Navigate to the API directory:
```bash
cd API
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

## Running the Project

### Development Mode

1. Start the backend server:
```bash
cd API
npm run dev
# or
yarn dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm run dev
# or
yarn dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

----
### Kubernetes Deployment

The project includes Kubernetes configurations in the `k8s/` directory. To deploy the application to Kubernetes:

1. Make sure you have kubectl and docker installed and running:

2. Before deploying, create two Kubernetes Secret files to store environment variables securely:
 
  `k8s/backend-secrets.yaml` and
  `k8s/frontend-secrets.yaml`

  You can use the provided sample files as a reference:

  `sample-backend-secrets.yaml` and
  `sample-frontend-secrets.yaml`


2. Deploy the application using this single script:
```bash
./build_deploy.sh
```

This script will:
- Build Docker images if they don't exist
- Push images to the local registry
- Deploy the application to Kubernetes
- Set up necessary services and configurations

The application will be available at:
- Frontend: http://localhost:31794 (or the port specified in the Kubernetes service)
- Backend API: http://localhost:30813 (or the port specified in the Kubernetes service)

## Additional Information

- The project uses TypeScript for type safety
- Docker and Kubernetes configurations are available for containerized deployment
