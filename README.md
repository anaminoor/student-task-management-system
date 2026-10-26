# StudyFlow — Student Task Management System

StudyFlow is a student-focused productivity web application designed to bring assignments, study sessions, academic planning, and progress tracking together in one workspace. Its goal is to help students stay organized, manage deadlines, and build consistent study habits.

## Features

- **Dashboard:** View a central overview of study and task activity.
- **Task management:** Organize tasks with details such as subject, due date, priority, status, estimated duration, and subtasks.
- **Calendar:** View academic tasks and deadlines in a calendar-oriented layout.
- **Academics:** Keep academic information organized.
- **Study sessions:** Use a dedicated study area with a Pomodoro-style timer.
- **Progress tracking:** Review study and task-completion activity.
- **Team workspace:** Organize team-related tasks and collaboration details.
- **AI assistant interface:** Access the project's AI-assistant page.
- **Account pages:** Sign-up and sign-in interfaces.
- **Settings:** Access profile and preference controls.
- **Personalization:** Light/dark theme controls and a responsive, mobile-first layout.
- **User-friendly interface:** Navigation, notifications/toasts, and loading states.

> **Note:** Features that depend on external services may require additional configuration. The project files provided are a front-end HTML, CSS, and JavaScript implementation; do not assume a production backend or live AI service is configured.

## Technologies Used

- **HTML5** — page structure
- **CSS3** — responsive styling, layout, and theme variables
- **JavaScript** — client-side interactions and application state
- **Browser Local Storage** — used by the client-side state implementation to persist supported data
- **Google Fonts** — DM Sans and Outfit

## Project Structure

```text
student-task-management-system/
├── index.html          # Landing page
├── login.html          # Sign-in page
├── signup.html         # Account creation page
├── dashboard.html      # Main dashboard
├── tasks.html          # Task management
├── calendar.html       # Calendar view
├── academics.html      # Academic overview
├── study.html          # Study sessions and focus timer
├── progress.html       # Progress and analytics
├── team.html           # Team workspace
├── ai.html             # AI assistant interface
├── settings.html       # Profile and preferences
├── 404.html            # Page-not-found screen
├── styles.css          # Shared styles
└── script.js           # Shared JavaScript and state logic
```

The project may contain additional assets or files depending on the version you use.

## Getting Started

### Prerequisites

- A modern web browser
- A code editor such as Visual Studio Code (recommended)

### Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/anaminoor/student-task-management-system.git
   ```

2. Move into the project directory:

   ```bash
   cd student-task-management-system
   ```

3. Open the folder in Visual Studio Code:

   ```bash
   code .
   ```

4. Run the website using a local development server. In VS Code, you can use the **Live Server** extension and open `index.html`.

   Alternatively, open `index.html` directly in a browser. A local server is generally preferable for testing.

## How to Use

1. Open `index.html` to visit the landing page.
2. Use **Sign Up** or **Sign In** to access the account interface.
3. Navigate through the dashboard and pages using the sidebar.
4. Add and organize tasks, review deadlines, and use the study-session tools.
5. Explore progress, academics, teams, AI assistant, and settings pages.
6. Use the theme control to switch between light and dark appearance.

## Live Demo

🚀 [View Live Website](https://your-project.vercel.app)

## Data and Privacy

This version uses client-side JavaScript and browser storage for supported application state. Data saved in browser storage is specific to that browser and origin; it is not automatically synchronized between devices. Avoid entering real passwords or sensitive personal information into a demo application unless authentication and data protection have been properly implemented.

## Future Improvements

Possible next steps for the project include:

- Add a secure backend and database for accounts and synchronized data.
- Implement secure authentication and password reset flows.
- Connect the AI assistant to a configured AI service.
- Add reminders and notifications for upcoming deadlines.
- Improve automated testing and accessibility.
- Add deployment instructions and screenshots.

## Contributing

If you are extending the project:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your work with a clear message.
5. Open a pull request describing the changes.

## Author

**Noor Anami**

## Repository

[Student Task Management System on GitHub](https://github.com/anaminoor/student-task-management-system)

---

*StudyFlow — your smarter student life.*
