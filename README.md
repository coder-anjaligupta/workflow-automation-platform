# **Workflow Automation Platform**
 
A full-stack Python-Based Drag & Drop Workflow Automation Platform built with FastAPI (Backend) and React Flow (Frontend), PostgreSQL, and Docker. This application enables users to visually design, manage, execute, import/export, and track dynamic multi-node automated workflows with comprehensive execution monitoring and custom node integrations.

---

## 📌 **Table of Contents**
1. [Project Overview](#1--project-overview)
2. [Setup & Installation Guide](#2-setup--installation-guide)
3. [Project Architecture](#3-project-architecture)
4. [API Documentation](#4--api-documentation)
5. [Folder Structure](#5--folder-structure)
6. [Workflow Engine Design](#6--workflow-engine-design)
7. [Database schema](#7--database-schema)
8. [Sample Workflows](#8--sample-workflows)
9. [Bonus Features & Enhancements](#9--bonus-features--enhancements)
10. [Screenshots](#10--screenshots)
11. [Future Improvements](#11--future-improvements)

---

## 1. 🚀 **Project Overview**
The **Workflow Automation Platform** is an end-to-end task automation builder. Users can register/login, visually construct complex node-based workflows (Start, HTTP Request, Logger, Python Function, File Upload, Email, Slack, End), configure custom node parameters, trigger automated sequential executions via a dynamic DAG pipeline, and monitor real-time execution logs and failure traces.

---

## 2. 🛠️ **Setup & Installation Guide**

### Prerequisites
* Python 3.10+
* Node.js (v18+) & npm
* PostgreSQL Database
* Docker & Docker Desktop (Optional for containerized run)

### **Option 1: Running with Docker (Recommended)**
---
Run the entire application stack (Backend, Frontend, PostgreSQL) with a single command:

```Bash
docker-compose up --build
```
### **Stopping the Application (Docker)**
---
To stop and remove all running backend, frontend, and database containers:

```bash
docker-compose down
```
To stop containers and also remove the database volume (clean reset):

```Bash
docker-compose down -v
```
---

* **Backend API:** `http://localhost:8000`

* **Frontend App:** `http://localhost:5173`

* **Swagger Docs:** `http://localhost:8000/docs`

---
### **Option 2: Local Manual Setup**
---
### **1. Backend Setup**
Navigate to the `backend` directory:

```Bash
cd backend

#Create and activate a Python virtual environment:
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

#Install dependencies:
pip install -r requirements.txt

#Run Alembic database migrations:
alembic upgrade head

#Start the FastAPI server:
uvicorn main:app --reload 
```

### **2. Frontend Setup**
Navigate to the `frontend` directory and install dependencies:

```Bash
cd frontend

#Install npm dependencies:
npm install

#Start Vite development server
npm run dev
```
---

## 3. 🏗️ **Project Architecture**

```text
                     +-------------------------------------------------------------------------+
                     |                       WORKFLOW AUTOMATION SYSTEM                        |
                     +-------------------------------------------------------------------------+
                                                         |
                                                         v
                  +------------------------------------------------------------------------------+
                  | [ FRONTEND LAYER ] - React.js + Vite + Tailwind CSS                          |
                  |  -- Authentication Views (Login / Register / JWT Local Storage)              |
                  |  -- Visual Workflow Canvas Builder (`src/components`, `App.jsx`, `main.jsx`) |
                  |  -- Dashboard & Execution Tracking UI                                        |
                  +------------------------------------------------------------------------------+
                                                         |
                                                         | HTTP / REST API Requests (JSON Payload)
                                                         v
                  +-------------------------------------------------------------------------+
                  | [ BACKEND LAYER ] - Python Service Engine (FastAPI / Flask)             |
                  |  -- Main Application Entrypoint & API Controller (`main.py`)            |
                  |  -- Security & Auth Module (`auth.py` - Bcrypt, JWT Tokens)             |
                  |  -- Request Data Validation Schemas (`schemas.py` - Pydantic Models)    |
                  |  -- Core Workflow Execution Engine (`execution_engine.py`)              |
                  |  -- Database Connection & ORM Management (`database.py`, `models.py`)   |
                  +-------------------------------------------------------------------------+
                                    |                                     |
                                    | SQL Queries / ORM                   | Config & Environment
                                    v                                     v
                  +---------------------------------------+ +-------------------------------+
                  | [ DATABASE LAYER ]                    | | [ CONFIG & CONTAINERIZATION ] |
                  |  -- Database Engine: PostgreSQL       | |  -- Docker (`Dockerfile`,     |
                  |     (Relational DB Service)           | |     `docker-compose.yml`)     |
                  |  -- ORM & Schema: SQLAlchemy          | |  -- Env Vars (`.env`)         |
                  |  -- Database Tables:                  | |  -- Dependencies              |
                  |     -- Users                          | |     (`requirements.txt`)      |
                  |     -- Workflows                      | |                               |
                  |     -- Tasks                          | |                               |
                  |     -- Activity Logs                  | |                               |
                  +---------------------------------------+ +-------------------------------+
```
---

## 4. 📄 **API Documentation**

FastAPI provides built-in interactive Swagger UI documentation.

   * **Swagger UI:** `http://localhost:8000/docs`

   * **ReDoc:** `http://localhost:8000/redoc`

### **General Endpoints**
```text
| Method |  Endpoint   |         Description            |
|--------|-------------|--------------------------------|
| `GET`  | `/api/data` | Fetch general application data |
```

### **Authentication & User Endpoints**
```text
| Method |  Endpoint   |             Description                       |
|--------|-------------|-----------------------------------------------|
| `POST` | `/register` | Register a new user account                   |
| `POST` | `/login`    | Authenticate user and return JWT access token |
| `GET`  | `/profile`  | Get logged-in user profile details            |
```

### **Workflow Endpoints**
```text
| Method |           Endpoint                   |         Description                           |
|--------|--------------------------------------|-----------------------------------------------|
|`GET`   | `/workflows`                         | List all workflows created by the user        |
|`POST`  | `/workflows`                         | Create and save a new workflow                |
|`GET`   | `/workflows/{workflow_id}`           | Retrieve specific workflow details by ID      |                               
|`PUT`   | `/workflows/{workflow_id}`           | Update an existing workflow by ID             |
|`DELETE`| `/workflows/{workflow_id}`           | Delete a workflow by ID                       |
|`POST`  | `/workflows/{workflow_id}/execute`   | Execute a saved workflow via execution engine |
|`GET`   | `/workflows/{workflow_id}/executions`| Get execution history and logs for a workflow |
|`POST`  | `/api/v2/upload`                     | Upload files for File Upload Node processing  |
```
---

## 5. 📁 **Folder Structure**

```text
my-fullstack-app/
├── backend/                                   # FastAPI Backend Service
│   ├── migrations/                            # Alembic database migration scripts
│   │   ├── versions/                          # Database migration version history files
│   │   ├── env.py                             # Migration environment setup script
│   │   ├── README                             # Alembic migrations guide
│   │   └── script.py.mako                     # Template for new migration scripts
│   ├── uploads/                               # Local storage for workflow uploaded files & JSON exports
│   ├── .dockerignore                          # Files ignored during backend Docker build process
│   ├── alembic.ini                            # Configuration file for Alembic database migrations
│   ├── auth.py                                # User authentication & JWT token handler
│   ├── database.py                            # PostgreSQL database connection setup
│   ├── Dockerfile                             # Docker container configuration for backend service
│   ├── execution_engine.py                    # Dynamic DAG workflow execution logic & node handlers
│   ├── main.py                                # FastAPI entry point & API route controllers
│   ├── models.py                              # SQLAlchemy database models (Users, Workflows, Executions)
│   ├── requirements.txt                       # Python dependencies list
│   └── schemas.py                             # Pydantic schemas for API request/response validation
├── frontend/                                  # Vite + React Frontend Application
│   ├── public/                                # Public static assets & HTML entry point
|   |   └── screenshots/                       # Application UI screenshots for documentation
│   ├── src/                                   # Application source code
│   │   ├── assets/                            # Static media files (icons, images, styles)
│   │   ├── components/                        # Reusable React components
│   │   │   └── CustomNode.jsx                 # Custom node components for workflow canvas
│   │   ├── App.css                            # Main application layout styles
│   │   ├── App.jsx                            # Primary React component & page router
│   │   ├── index.css                          # Global UI & Tailwind CSS styles
│   │   └── main.jsx                           # Application entry point rendering React DOM
│   ├── .dockerignore                          # Files ignored during frontend Docker build process
│   ├── .gitignore                             # Git ignore rules for frontend directory
│   ├── .oxlintrc.json                         # Linter configuration file
│   ├── Dockerfile                             # Docker container configuration for frontend service
│   ├── index.html                             # Main HTML template file
│   ├── package-lock.json                      # Dependency version lockfile
│   ├── package.json                           # Node.js dependencies & build scripts
│   ├── postcss.config.js                      # PostCSS plugin configurations
│   ├── README.md                              # Frontend module overview
│   ├── tailwind.config.js                     # Tailwind CSS styling options
│   └── vite.config.js                         # Vite build configuration
├── .gitignore                                 # Root Git ignore rules (env, node_modules, logs)
├── docker-compose.yml                         # Multi-container orchestration (Backend, Frontend, DB)
└── README.md                                  # Comprehensive platform documentation
```
---

## 6. ⚙️ **Workflow Engine Design**
The core execution engine processes visual graphs as Directed Acyclic Graphs (DAGs):

   * **Graph Parsing:** Frontend graph layouts (nodes and connecting edges) are parsed into JSON arrays.

   * **Topological Sorting:** The engine resolves node dependencies to determine execution order.

   * **Node Handlers & Dispatchers:** Each node type (`Start`, `File Upload`, `Email`, `Slack`, `End`) routes to a dedicated execution function.

   * **Execution Context:** Data and payload outputs pass seamlessly from parent nodes to child nodes.

   * **Error Handling & State Persistence:** Failure at any node halts execution, captures execution logs/stack traces, and persists status (`SUCCESS`, `FAILED`) into PostgreSQL.

---

## 7. 💾 **Database Schema**
The database relies on PostgreSQL managed through SQLAlchemy ORM and Alembic migrations.

```text
                           +-----------------------------------+
                           |               USERS               |
                           +-----------------------------------+
                           | * id (PK)                         |
                           | * email                           |
                           | * password_hash                   |
                           | * role                            |
                           | * created_at                      |
                           +-----------------------------------+
                                    |                  |
                              1:N   |                  | 1:N
                                    v                  v
                           +-------------------+   +-------------------+
                           |     WORKFLOWS     |   |   ACTIVITY_LOGS   |
                           +-------------------+   +-------------------+
                           | * id (PK)         |   | * id (PK)         |
                           | * title           |   | * action          |
                           | * description     |   | * user_id (FK)    |
                           | * status          |   | * timestamp       |
                           | * user_id (FK)    |   +-------------------+
                           | * created_at      |
                           +-------------------+
                                    |
                              1:N   |
                                    v
                           +-------------------+
                           |       TASKS       |
                           +-------------------+
                           | * id (PK)         |
                           | * task_name       |
                           | * status          |
                           | * execution_time  |
                           | * workflow_id (FK)|
                           +-------------------+
```
---

### **Table Definitions**

**1. Users Table**
```text
* id (INTEGER, Primary Key)
* email (VARCHAR, Unique, Indexed, Non-nullable)
* password_hash (VARCHAR, Hashed string, Non-nullable)
* role (VARCHAR, Default: 'user')
* created_at (TIMESTAMP WITH TIMEZONE, Default: NOW())
```

**2. Workflows Table**
```text
*  id (INTEGER, Primary Key)
*  title (VARCHAR, Non-nullable)
*  description (TEXT, Nullable)
*  status (VARCHAR, e.g., 'active', 'draft', 'archived')
*  user_id (INTEGER, Foreign Key referencing users.id, Non-nullable)
*  created_at (TIMESTAMP WITH TIMEZONE, Default: NOW())
```

**3. Tasks Table**
```text
*  id (INTEGER, Primary Key)
*  task_name (VARCHAR, Non-nullable)
*  status (VARCHAR, e.g., 'PENDING', 'SUCCESS', 'FAILED')
*  execution_time (VARCHAR / FLOAT, Nullable)
*  workflow_id (INTEGER, Foreign Key referencing workflows.id, Non-nullable)
```

**4. Activity_Logs Table**
```text
*  id (INTEGER, Primary Key)
*  action (VARCHAR, Non-nullable)
*  user_id (INTEGER, Foreign Key referencing users.id, Non-nullable)
*  timestamp (TIMESTAMP WITH TIMEZONE, Default: NOW())
```
---


## 8. 🔄 **Sample Workflows**

**1. Custom Python Data Processing Workflow**
---

   * **Goal:** Run custom Python computational scripts and validate output responses safely.

   * **Node Chain:** `Start Node` -> `Python Function Node` -> `Logger Node` -> `End Node`

```text
[Start Node] ──> [Python Function Node] ──> [Logger Node] ──> [End Node]
```

   * **Execution Steps:**

       1. Start Node receives input JSON payload.

       2. Python Function Node parses DAG parameters and runs custom script logic inside execution engine.

       3. Logger Node captures output response and runtime trace logs.

       4. Saves execution state to PostgreSQL database.

---
**2. Conditional Email Alert Dispatcher**
---

   * **Goal:** Validate business conditions dynamically and trigger automated email notifications.
 
   * **Node Chain:** `Start Node` -> `Condition Node` -> `Email Node` / `Logger Node` -> `End Node`

```text
               ┌──> [True]  ──> [Email Node] ──┐
[Start Node] ──┤                               ├──> [End Node]
               └──> [False] ──> [Logger Node] ─┘
``` 

   * **Execution Steps:**

       1. Condition Node evaluates incoming payload values against target rules (e.g., status check).

       2. If condition evaluates to True, execution routes to Email Node to dispatch automated emails.

       3. If condition evaluates to False, execution routes to fallback Logger Node.

       4. Step execution details and status codes are stored persistently.
---
**3. Document Ingestion & Verification Pipeline**
---

   * **Goal:** Process uploaded user documents, validate file extensions, and record execution logs.

   * **Node Chain:** `Start Node` -> `File Upload Node` -> `Logger Node` -> `End Node`

```text
[Start Node] ──> [File Upload Node (.pdf/.png/.csv)] ──> [Logger Node] ──> [End Node]
```

   * **Execution Steps:**

       1. Triggered via API request or manual canvas UI execution.

       2. File Upload Node checks file extension (.pdf, .csv) and stores the file in backend /uploads.

       3. Logger Node records execution state and file details into PostgreSQL executions table.

       4. Returns final SUCCESS status response upon workflow completion.     
---

## 9. ⭐ **Bonus Features & Enhancements**
Beyond core requirements, the system includes the following advanced capabilities:

### **1. Extended Custom Node Library:**

   * **Slack Integration Node:** Dedicated custom component for real-time Slack channel webhooks.

   * **Email Node:** Automated notification trigger component.

   * **File Upload Node:** Custom node supporting local file uploads with type and extension checks (.pdf, .csv).

### **2. Import / Export Workflow Functionality:**

   * Full JSON export capability to share workflow designs.

   * One-click workflow import to instantly recreate node graphs on the canvas.

### **3. Persisted Error Trace Logging:**

   * Migrated database schema (add_error_to_executions) to record detailed error stack traces directly into the error column of the executions table for auditability.

### **4. Full Containerization & Multi-Container Setup:**

   * Includes standalone Dockerfile configurations and docker-compose.yml to orchestrate Backend, Frontend, and Database.

### **5. Secure Authentication & User Isolation:**

   * JWT-token based security ensuring user-level isolation of workflows and execution history.

---

## 10. 🖼️ **Screenshots**

```text
frontend/
    └──public/
        └──screenshots/
```        

* **Authentication (auth-screen.png):** Login and Registration interface for secure user access.
* **Workflow Canvas (canvas-view.png):** Drag-and-drop React Flow canvas with custom nodes for building workflows.
* **Execution & Logs (workflow-execution.png):** Live execution status and JSON response logs showing step-by-step workflow output.

---

![Auth Screen](./frontend/public/screenshots/auth-screen.png)

---

![Canvas View](./frontend/public/screenshots/canvas-view.png)

---

![Execution Logs](./frontend/public/screenshots/workflow-execution-input.png)

---

![Execution Logs](./frontend/public/screenshots/workflow-execution-result.png)

---

## 11. 🔮 **Future Improvements**

* **Cron Scheduler Node:** Periodic/automated cron-based workflow triggers.
* **Webhook Trigger Node:** External API endpoint listening triggers.
* Multi-tenant role-based access control (RBAC).
* Real-time WebSocket updates during workflow execution.
* **AI Node Integration:** OpenAI API nodes for natural language data transformation.

---

