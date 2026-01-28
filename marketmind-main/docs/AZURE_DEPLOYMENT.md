# Azure Deployment Guide for Street League Platform

This guide walks you through deploying the Street League platform to Azure Static Web Apps with Azure Functions for Databricks integration.

## Prerequisites

1. **Azure Account** with an active subscription
2. **Azure CLI** installed locally ([Install guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
3. **Azure Functions Core Tools** v4+ ([Install guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local))
4. **Node.js 18+** installed
5. **GitHub repository** connected to this project

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌────────────────────┐
│                     │     │                      │     │                    │
│  Azure Static       │────▶│  Azure Functions     │────▶│  Azure Databricks  │
│  Web Apps           │     │  (API Layer)         │     │  SQL Warehouse     │
│                     │     │                      │     │                    │
└─────────────────────┘     └──────────────────────┘     └────────────────────┘
```

## Step 1: Create Azure Resources

### 1.1 Create Resource Group

```bash
az group create \
  --name street-league-rg \
  --location uksouth
```

### 1.2 Create Azure Static Web App

```bash
az staticwebapp create \
  --name street-league-web \
  --resource-group street-league-rg \
  --location "West Europe" \
  --sku Standard
```

### 1.3 Create Azure Function App

```bash
# Create storage account for Functions
az storage account create \
  --name streetleaguestorage \
  --resource-group street-league-rg \
  --location uksouth \
  --sku Standard_LRS

# Create Function App
az functionapp create \
  --name street-league-api \
  --resource-group street-league-rg \
  --storage-account streetleaguestorage \
  --consumption-plan-location uksouth \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4
```

## Step 2: Configure Databricks Connection

### 2.1 Get Databricks Credentials

1. Go to your Azure Databricks workspace
2. Navigate to **SQL Warehouses** → Select your warehouse
3. Click **Connection details** and note:
   - **Server hostname**: `your-workspace.azuredatabricks.net`
   - **HTTP Path**: `/sql/1.0/warehouses/your-warehouse-id`

4. Generate a Personal Access Token:
   - Click your profile → **User Settings** → **Developer** → **Access Tokens**
   - Click **Generate new token**
   - Save the token securely

### 2.2 Configure Function App Settings

```bash
az functionapp config appsettings set \
  --name street-league-api \
  --resource-group street-league-rg \
  --settings \
    DATABRICKS_HOST="your-workspace.azuredatabricks.net" \
    DATABRICKS_HTTP_PATH="/sql/1.0/warehouses/your-warehouse-id" \
    DATABRICKS_TOKEN="your-personal-access-token"
```

## Step 3: Deploy Azure Functions

### 3.1 Build and Deploy

```bash
cd azure-functions

# Install dependencies
npm install

# Build TypeScript
npm run build

# Deploy to Azure
func azure functionapp publish street-league-api
```

### 3.2 Configure CORS

```bash
az functionapp cors add \
  --name street-league-api \
  --resource-group street-league-rg \
  --allowed-origins "https://your-static-web-app.azurestaticapps.net"
```

## Step 4: Deploy Static Web App

### 4.1 Connect GitHub Repository

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Static Web App
3. Click **Deployment** → **Manage deployment token**
4. Copy the deployment token

### 4.2 Add GitHub Secrets

In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`: The deployment token from above
   - `VITE_API_BASE_URL`: `https://street-league-api.azurewebsites.net/api`

### 4.3 Trigger Deployment

Push to main branch or manually trigger the workflow:

```bash
git push origin main
```

## Step 5: Verify Deployment

### 5.1 Test Health Endpoint

```bash
curl https://street-league-api.azurewebsites.net/api/databricks-health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T12:00:00.000Z",
  "databricks": {
    "connected": true,
    "host": "configured",
    "httpPath": "configured",
    "token": "configured"
  }
}
```

### 5.2 Test Data Query

```bash
curl "https://street-league-api.azurewebsites.net/api/databricks-query?table=region&limit=5"
```

## Environment Variables Reference

### Azure Functions (Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABRICKS_HOST` | Databricks workspace hostname | `your-workspace.azuredatabricks.net` |
| `DATABRICKS_HTTP_PATH` | SQL Warehouse HTTP path | `/sql/1.0/warehouses/abc123` |
| `DATABRICKS_TOKEN` | Personal Access Token | `dapi...` |

### Frontend (Build-time)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Azure Functions API URL | `https://street-league-api.azurewebsites.net/api` |

## Troubleshooting

### CORS Errors

Ensure the Static Web App URL is added to CORS settings:

```bash
az functionapp cors show --name street-league-api --resource-group street-league-rg
```

### Databricks Connection Failures

1. Verify the SQL Warehouse is running
2. Check the Personal Access Token hasn't expired
3. Ensure network access is allowed from Azure Functions

### Deployment Failures

Check GitHub Actions logs:
1. Go to **Actions** tab in GitHub
2. Click on the failed workflow run
3. Review the error messages

## Security Recommendations

1. **Use Managed Identity** instead of Personal Access Tokens for production
2. **Enable Azure AD authentication** on the Static Web App
3. **Configure IP restrictions** on the Function App
4. **Enable Application Insights** for monitoring
5. **Use Azure Key Vault** for secret management

## Next Steps

1. Set up Azure AD authentication
2. Configure custom domain
3. Enable Application Insights monitoring
4. Set up staging environments
5. Configure CI/CD for the Azure Functions
