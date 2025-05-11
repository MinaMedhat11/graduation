# Learning Management System

This educational platform provides a complete learning management system with distinct interfaces for students, instructors, and administrators.

## Project Overview

The Learning Management System consists of:
- Student portal for course enrollment, assignments, and learning
- Admin dashboard for managing courses, students, and system settings
- Responsive design with consistent styling across all interfaces
- Material UI components for modern, accessible user experience

## Recent Updates
- **Layout Consistency**: Improved the admin layout to ensure consistent styling with the student portal
- **Logo Visibility**: Enhanced logo placement and visibility in navigation sidebars
- **UI Refinements**: Standardized colors, spacing, and component styling across the application

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Project Specific Updates

### Recent Changes (Development Environment - May 2025)

- **Environment Configuration:**
  - Updated package.json scripts to use cross-env for setting environment variables
  - Added cross-env to ensure consistent environment variable handling across platforms
  - Created .env configuration files for proper Babel environment setup
  - Fixed Babel configuration issues to ensure proper JSX compilation
  - Added VS Code support files to improve development experience

- **Asset Management:**
  - Updated logo and icon across all application components
  - Restructured image assets into proper folders:
    - Source images in `src/Images/` and its subfolders
    - Public assets in `public/` directory
    - Favicon and app icons standardized across the application
  - Ensured consistent image import paths throughout components

### Recent Changes (Layout & Styling - July 2024)

- **Routing Structure Verified:** Confirmed the use of separate layouts (`Layout.jsx` for users, `AdminLayout.jsx` for admin) controlled via `src/App.js` using `react-router-dom`.
- **Main User Layout Created:** Created `src/Components/Layout/Layout.jsx` to provide the basic structure (sidebar, top bar) for user-facing pages, based on design screenshots.
- **MUI Theme Implemented:**
    - Created `src/theme.js` to define a custom MUI theme (colors, typography, basic component overrides) reflecting the design screenshots.
    - Applied the theme globally using `ThemeProvider` and `CssBaseline` in `src/App.js`.
- **Admin Layout Styling:** Refined the styles of `src/Components/Admin/Layout/AdminLayout.jsx` (AppBar, Drawer, ListItems) to align more closely with the visual design in the screenshots.
- **Admin Course List Styling:** Refined the styles of `src/Components/Admin/Courses/AdminCourses.jsx` (Table, Chips, Buttons, Search) to align more closely with the visual design.

### Course Creation Flow
- Implemented a multi-step course editor (`src/Components/CourseEditor/CourseEditor.jsx`) with separate forms for:
  - Basic Information (`BasicInfoForm.jsx`)
  - Advance Information (`AdvanceInfoForm.jsx`)
  - Content Management (`ContentForm.jsx`)
  - Publish Settings (`PublishForm.jsx`)
- Components use Material UI for layout and form elements.

### Course Detail View
- Implemented the student-facing course detail page (`src/Components/CourseDetail/CourseDetail.jsx`).
- Features include a two-column layout, video placeholder, course stats, tabbed navigation (Overview, Reviews, Content, etc.), syllabus display using Accordions, and mock data.

## Development Environment Setup

### Environment Variables
This project uses environment variables for proper Babel configuration. The following files have been set up:
- `.env`: Contains base environment variables
- `.env.local`: Contains local overrides (gitignored)
- `.env.development`: Contains development-specific variables

### Cross-Platform Development
We use `cross-env` to ensure environment variables work consistently across different operating systems. This is configured in the package.json scripts.

### Quick Start for New Developers
1. Clone the repository
2. Run `npm install --legacy-peer-deps` to install dependencies
3. Run `npm start` to start the development server
4. If you encounter any Babel configuration issues, verify that:
   - cross-env is installed
   - .env files are properly set up
   - package.json scripts are using cross-env

### VS Code Setup
Several VS Code configuration files have been added to improve the development experience:
- `.vscode/settings.json`: Editor settings
- `.vscode/extensions.json`: Recommended extensions
- `.eslintrc.js`: ESLint configuration

## Project Structure

### Key Components
- **Layout Components**: Consistent design system for Admin and Student interfaces
  - `src/Components/Layout/Layout.jsx`: Main student-facing layout
  - `src/Components/Admin/Layout/AdminLayout.jsx`: Administrator interface layout
- **Authentication**: Role-based access control for different user types
- **Course Management**: Tools for creating and managing educational content
- **User Management**: Student and instructor profile handling

### Design System
The application follows a consistent design system across all interfaces:

1. **Navigation**:
   - Fixed sidebars with standardized height and styling
   - Consistent logo placement and visibility
   - Unified active/hover states for menu items

2. **Visual Elements**:
   - Standard logo size (40px height) across layouts
   - Consistent header height (64px)
   - Uniform background colors (#FFFFFF for headers, #F1F5F9 for drawers)
   - Standardized spacing and padding

3. **Component Patterns**:
   - Material UI styled components for consistent theming
   - Responsive drawer components
   - Standardized icon usage and placement
   - Consistent search bar implementation

## Development Guidelines

When contributing to this project:

1. **Maintain Visual Consistency**:
   - Use existing component patterns
   - Follow the established color scheme
   - Maintain consistent spacing and sizing

2. **Component Architecture**:
   - Reuse existing styled components when possible
   - Follow the established project structure
   - Ensure responsive behavior works on all screen sizes

3. **Testing**:
   - Verify changes on multiple browsers (Chrome, Firefox, Edge)
   - Test responsive views for mobile devices
   - Check for visual consistency between layouts

## Recent Changes (May 2025)
- **Admin Layout Enhancement**: Fixed logo visibility issues in the admin sidebar
- **Styling Consistency**: Standardized styling between admin and student layouts
- **Code Cleanup**: Removed unused variables and improved code organization
- **Documentation**: Added comprehensive documentation for layout components
