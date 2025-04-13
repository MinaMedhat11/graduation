# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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
