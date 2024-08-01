import requests

# Forgejo API base URL and token
API_BASE_URL = 'https://git.nisu.codes/api/v1'
API_TOKEN = '92fcf3d74d7b9bb7ef4a33f6acf90fb5ffda494b'
REPO_OWNER = 'olea-cms'
REPO_NAME = 'olea-cms'

# Headers for authentication
HEADERS = {
    'Authorization': f'token {API_TOKEN}',
    'Content-Type': 'application/json'
}

def create_project(name, description):
    url = f'{API_BASE_URL}/repos/{REPO_OWNER}/{REPO_NAME}/projects'
    data = {
        'name': name,
        'body': description
    }
    response = requests.post(url, json=data, headers=HEADERS)
    if response.ok:
        print(f"Project '{name}' created successfully.")
        return response.json()['id']
    else:
        print(f"Failed to create project '{name}': {response.text}")
        return None

def create_milestone(title, description):
    url = f'{API_BASE_URL}/repos/{REPO_OWNER}/{REPO_NAME}/milestones'
    data = {
        'title': title,
        'description': description
    }
    response = requests.post(url, json=data, headers=HEADERS)
    if response.ok:
        print(f"Milestone '{title}' created successfully.")
        return response.json()['id']
    else:
        print(f"Failed to create milestone '{title}': {response.text}")
        return None

def create_issue(title, body, milestone_id=None, project_id=None):
    url = f'{API_BASE_URL}/repos/{REPO_OWNER}/{REPO_NAME}/issues'
    data = {
        'title': title,
        'body': body,
        'milestone': milestone_id,
    }
    response = requests.post(url, json=data, headers=HEADERS)
    if response.ok:
        print(f"Issue '{title}' created successfully.")
    else:
        print(f"Failed to create issue '{title}': {response.text}")

# Create projects
projects = [
    ("Environment Setup and Initial Scaffolding", "Setup and configuration of the development environment."),
    ("Basic Functionality Implementation", "Development of core CMS features."),
    ("Advanced Features and Enhancements", "Adding advanced features and functionalities."),
    ("Testing and Optimization", "Testing and performance optimization."),
    ("Documentation", "Create comprehensive documentation for the CMS."),
    ("Deployment", "Set up production deployment pipelines."),
    ("Gathering User Feedback", "Collect feedback post-launch for improvements."),
    ("Post-Launch Optimization", "Optimize performance and scalability post-launch."),
    ("Feature Enhancements", "Implement enhancements based on feedback."),
    ("Regular Maintenance", "Schedule regular updates and maintenance.")
]

# Store project IDs for future reference
project_ids = {}

for name, description in projects:
    project_id = create_project(name, description)
    if project_id:
        project_ids[name] = project_id

# Create milestones for initial setup and functionality
milestones = [
    ("Monorepo Setup", "Setup of the monorepo structure and development environment.", project_ids["Environment Setup and Initial Scaffolding"]),
    ("Initialize Project", "Initialize backend and frontend projects with basic structure.", project_ids["Environment Setup and Initial Scaffolding"]),
    ("CI/CD Pipeline", "Set up Forgejo Actions for continuous integration and deployment.", project_ids["Environment Setup and Initial Scaffolding"]),
    ("User Authentication", "Implement user registration and login functionality.", project_ids["Basic Functionality Implementation"]),
    ("Configurable Sections", "Allow creation and management of configurable sections.", project_ids["Basic Functionality Implementation"]),
    ("Frontend Integration", "Develop dynamic pages and integrate frontend technologies.", project_ids["Basic Functionality Implementation"]),
    ("SEO Tools", "Implement basic SEO tools and optimizations.", project_ids["Basic Functionality Implementation"]),
    ("Admin Interface", "Develop an interface for managing content and users.", project_ids["Basic Functionality Implementation"]),
    ("Multimedia Support", "Enable multimedia upload and management.", project_ids["Advanced Features and Enhancements"]),
    ("Rich Text Editor", "Implement a rich text editor for content creation.", project_ids["Advanced Features and Enhancements"]),
    ("Advanced SEO Tools", "Add advanced SEO features and integrations.", project_ids["Advanced Features and Enhancements"]),
    ("User Roles and Permissions", "Implement role-based access control.", project_ids["Advanced Features and Enhancements"]),
    ("Comprehensive Testing", "Ensure all features are thoroughly tested.", project_ids["Testing and Optimization"]),
    ("Code Review and Refactoring", "Conduct code reviews and refactor as necessary.", project_ids["Testing and Optimization"]),
]

milestone_ids = {}

for title, description, project_id in milestones:
    milestone_id = create_milestone(title, description)
    if milestone_id:
        milestone_ids[title] = milestone_id

# Create issues for functionality and other projects
issues = [
    # Environment Setup and Initial Scaffolding
    ("Set up monorepo on Forgejo", "Create a repository and structure it for monorepo usage.", milestone_ids["Monorepo Setup"]),
    ("Configure development environments using Nix Flakes", "Ensure reproducible development environments.", milestone_ids["Monorepo Setup"]),
    ("Set up FeathersJS with Express", "Initialize backend framework with Express and FeathersJS.", milestone_ids["Initialize Project"]),
    ("Set up Forgejo Actions for CI/CD", "Create workflows for continuous integration.", milestone_ids["CI/CD Pipeline"]),

    # Basic Functionality Implementation
    ("Implement user registration and login", "Develop authentication module for users.", milestone_ids["User Authentication"]),
    ("Implement JWT authentication", "Secure user authentication with JWT.", milestone_ids["User Authentication"]),
    ("Write tests for authentication", "Test all authentication workflows and error handling.", milestone_ids["User Authentication"]),
    ("Create CRUD operations for sections", "Develop CRUD functionality for configurable sections.", milestone_ids["Configurable Sections"]),
    ("Implement section hierarchy management", "Manage hierarchy for nested sections.", milestone_ids["Configurable Sections"]),
    ("Write tests for section management", "Ensure robust testing of section CRUD operations.", milestone_ids["Configurable Sections"]),
    ("Develop dynamic pages with HTMX and Alpine.js", "Create interactive front-end pages.", milestone_ids["Frontend Integration"]),
    ("Implement server-side rendering with Pug", "Render pages server-side using Pug templates.", milestone_ids["Frontend Integration"]),
    ("Write tests for frontend interactions", "Test frontend behavior and UI interactions.", milestone_ids["Frontend Integration"]),

    # Advanced Features and Enhancements
    ("Enable image uploads", "Implement functionality for uploading images.", milestone_ids["Multimedia Support"]),
    ("Add support for uploading videos", "Expand multimedia support to include video uploads.", milestone_ids["Multimedia Support"]),
    ("Integrate rich text editor", "Allow content creation with rich text capabilities.", milestone_ids["Rich Text Editor"]),
    ("Implement role-based access control", "Set up user roles and permissions.", milestone_ids["User Roles and Permissions"]),

    # Other Projects (without specific milestones)
    ("Gather documentation requirements", "Collect necessary documentation for all features.", None, project_ids["Documentation"]),
    ("Set up deployment pipelines", "Configure pipelines for automated deployments.", None, project_ids["Deployment"]),
    ("Collect user feedback", "Use surveys and interviews to gather feedback.", None, project_ids["Gathering User Feedback"]),
    ("Analyze performance post-launch", "Review performance metrics and logs to identify improvements.", None, project_ids["Post-Launch Optimization"]),
    ("Plan feature enhancements", "Identify potential features and improvements.", None, project_ids["Feature Enhancements"]),
    ("Schedule regular updates", "Plan and execute regular maintenance updates.", None, project_ids["Regular Maintenance"]),
]

for title, body, milestone_id, project_id in issues:
    create_issue(title, body, milestone_id, project_id)
