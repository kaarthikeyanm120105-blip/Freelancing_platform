# TVK (Talent Venture Konnect)

Talent Venture Konnect (TVK) is a comprehensive freelance marketplace platform designed to connect skilled freelancers with clients seeking talent. The platform features role-based access control, AI-powered insights, real-time communication, and secure payment processing.

---

## 🚀 Application Workflow

1.  **Onboarding**: Users start at the **Landing Page**, where they can learn about the platform. They then proceed to **Signup** and **OTP Verification**.
2.  **Role Selection**: Upon first login, users choose their identity: **Freelancer**, **Client**, or **Admin** (System entry).
3.  **Profile Setup**: Based on their role, users complete a specialized profile setup (Portfolio/Skills for Freelancers, Company/Project details for Clients).
4.  **Marketplace Interaction**:
    *   **Clients** post jobs and review applications.
    *   **Freelancers** browse jobs, apply for projects, and manage their growth journey.
5.  **Execution & Collaboration**: Integrated **Real-time Chat** (Socket.io) allows for seamless communication.
6.  **Payments & Completion**: **Stripe** integration handles secure payments, with a dedicated **Wallet** for managing earnings and payouts.
7.  **AI Insights**: The platform uses **Gemini AI** and **OpenAI** to provide learning recommendations, document analysis, and project summaries.

---

## 👥 Role Explanations

### 🛠️ Admin Role
The Admin is the platform's overseer, ensuring a safe and productive environment.
*   **Purpose**: To maintain platform integrity and monitor overall health.
*   **Key Functions**:
    *   **User Management**: Approve, suspend, or manage user accounts.
    *   **Job Moderation**: Review and moderate job postings to prevent spam or fraud.
    *   **Payment Monitoring**: Oversee financial transactions and resolve disputes.
    *   **Course Management**: Update and manage learning recommendations for freelancers.
    *   **Platform Reports**: Access analytics on platform growth and activity.

### 💼 Client Role
Clients are the "Project Owners" who bring work to the platform.
*   **Purpose**: To find and hire top talent for specific business needs.
*   **Key Functions**:
    *   **Job Posting**: Create detailed job listings with budget and skill requirements.
    *   **Application Review**: Filter and interview freelancers who applied for their jobs.
    *   **Payment Management**: Fund projects and release payments upon successful completion.
    *   **Profile Management**: Showcase their brand to attract high-quality talent.

### 🎨 Freelancer Role
Freelancers are the "Service Providers" who execute the work.
*   **Purpose**: To find work, build a portfolio, and grow their professional career.
*   **Key Functions**:
    *   **Job Browsing**: Filter and find jobs that match their skill set.
    *   **Proposal Submission**: Apply for jobs with customized pitches.
    *   **Growth Journey**: View AI-driven learning recommendations to improve skills.
    *   **Financial Tracking**: Manage earnings through the Wallet and track performance.

---

## 📄 Pages and Components

### Core Pages
*   **Landing Page**: The front-facing marketing site.
*   **Login/Signup**: Standard authentication flow with OTP verification.
*   **Role Selection**: A critical step to define the user's path.
*   **Dashboard**: A centralized hub (role-specific) for all daily activities.
*   **Messages**: A real-time chat interface for collaboration.
*   **Connect**: A networking space to find other professionals.

### Component Architecture
*   **ProtectedRoute**: Ensures only authorized users access specific routes.
*   **DashboardLayout**: A standard container for all internal dashboard pages.
*   **RoleBasedComponent**: Dynamically renders views based on the logged-in user type.
*   **Wallet/Earnings**: Reusable modules for financial data visualization.

---

## 🛠️ Technology Stack

### Languages & Frameworks
*   **Frontend**: React (Vite-powered), Javascript, Tailwind CSS.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (via Mongoose).
*   **Styling**: Vanilla CSS, Tailwind CSS, Material UI (MUI), Radix UI.

### External Sources & Integrations
*   **Stripe**: Secure payment gateway and escrow management.
*   **Google Gemini AI**: Powering intelligent learning recommendations and document analysis.
*   **OpenAI**: Additional AI capabilities for content generation and summaries.
*   **Nodemailer**: Automated Email/OTP delivery.
*   **Socket.io**: Real-time bidirectional communication.

---

## 📦 Dependencies

### Backend
*   `express`: Web framework.
*   `mongoose`: MongoDB object modeling.
*   `jsonwebtoken` & `bcrypt`: Security and authentication.
*   `multer`: File upload handling (Resumes/Deliverables).
*   `stripe`: Payment processing.
*   `@google/generative-ai`: Gemini AI integration.
*   `socket.io`: Real-time engine.

### Frontend
*   `react-router-dom`: SPA routing.
*   `recharts`: Data visualization for earnings and growth.
*   `framer-motion`: Smooth animations and transitions.
*   `lucide-react`: Modern iconography.
*   `axios`: HTTP client for API communication.
*   `radix-ui` & `mui`: UI component libraries.

---

© 2026 TVK (Talent Venture Konnect). All Rights Reserved.
