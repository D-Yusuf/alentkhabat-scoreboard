# Scoreboard: A Versatile Scorekeeping PWA

A modern, responsive Progressive Web App (PWA) for tracking scores, perfect for games and sports. Built with React, Vite, and Tailwind CSS.

## ✨ Features

-   **Dual Scoreboards**: Separate, persistent score tracking for both teams and individual players.
-   **Round Management**: Flexible round system for player scores, with automatic or manual round counting.
-   **PWA Ready**: Installable on any device (iOS, Android, Desktop) for an app-like experience.
-   **Multi-language Support**: Fully translated in English and Arabic with RTL support.
-   **Customizable Theme**: Light and Dark modes to suit your preference.
-   **Persistent State**: Your scores and settings are saved locally, so you never lose your data.
-   **Modern UI**: Clean, intuitive interface built with shadcn/ui.

## 🛠️ Tech Stack

-   **Framework**: React (with Vite)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: shadcn/ui
-   **Internationalization**: i18next
-   **State Management**: React Context API

## 🚀 Getting Started (Local Development)

To run the application on your local machine, follow these steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm (or yarn/pnpm)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.

## 🌐 Deployment to a Web Host

This project is built as a static single-page application (SPA). You can host it on any service that supports static file hosting (e.g., Netlify, Vercel, GitHub Pages, AWS S3, or your own server).

Here are the general steps:

### 1. Build the Application

First, you need to create a production-ready build of the app. This command compiles all the code and assets into a `dist` directory.

Run the following command in your project's root directory:

```bash
npm run build
```

This will create a `dist` folder. The contents of this folder are all you need to deploy.

### 2. Deploy the `dist` Folder

Upload the **contents** of the `dist` folder to your web host's public directory (this might be named `public_html`, `www`, `htdocs`, or similar).

**Example File Structure on Server:**

```
/public_html
├── index.html
├── assets/
│   ├── index-*.js
│   ├── index-*.css
│   └── ... (other generated assets)
├── Full-Logo.png
├── robots.txt
└── ... (other files from the dist folder)
```

### 3. Configure Server for Single-Page Applications (SPA)

Since this is a single-page application that uses client-side routing (React Router), your server needs to be configured to handle page reloads and direct navigation correctly.

You must configure a "catch-all" or "rewrite" rule that redirects all incoming requests to your `index.html` file. This allows React Router to take over and display the correct page.

**For Apache Servers:**

Create or edit the `.htaccess` file in your public directory (`public_html`) and add the following:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**For Nginx Servers:**

Add the following `location` block to your server configuration:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**For Hosting Platforms (Netlify, Vercel, etc.):**

These platforms typically detect that you are deploying a React/Vite application and configure the rewrite rules for you automatically. You usually just need to:
1.  Connect your Git repository.
2.  Set the build command to `npm run build`.
3.  Set the publish/public directory to `dist`.

## 📱 PWA Installation

The application can be installed on your mobile device or desktop for easy access.
-   **On Mobile**: Use the "Add to Home Screen" option in your browser's share menu.
-   **On Desktop**: Look for an install icon in the browser's address bar.

The app includes a help icon in the Settings page with platform-specific instructions.