# MindCare NER — Figma File Structure & UI/UX Specification

This specification defines the complete 17-page Figma system dividing MindCare NER into two distinct experiences: **Experience 01 (Public Marketing Landing Website)** and **Experience 02 (Authenticated Application / Dashboard)**.

---

## 📑 17-Page Figma Structure

```
01 — Cover
├── Project Thumbnail & Metadata (MindCare NER - Dark Medical Theme)
└── Version Changelog & Design System Tokens

02 — Brand & Design System
├── Color Palette Swatches (Tokens: Primary Teal, Medical Blue, AI Purple, Surfaces)
├── Typography Scales (Inter / Manrope: Desktop Marketing vs Dashboard vs Patient UI)
├── Iconography Matrix (Lucide Healthcare set: 24px, 20px, 16px)
├── Grid & Spacing System (4px / 8px baseline, 12-column 1440px desktop grid)
└── Elevation & Glass Surface Tokens

03 — Public Landing — Desktop (1440px)
├── Navigation: Public Marketing Header (Home, Features, How It Works, Roles, Login, CTA)
├── Hero: "REMEMBER. ENGAGE. CONNECT." + 3D Antigravity Sphere Ecosystem Canvas
├── Trust Bar: 5 Core Badges (Accessible, Connected, Multilingual, Personalized, Privacy)
├── Problem Statement: 4 Regional Healthcare Reality Cards
├── Solution Diagram: MindCare NER Central AI Hub connected to all 8 ecosystem nodes
├── Feature Grid: 6 Pillars of Everyday Cognitive Support
├── How It Works: 4-Step Interactive Timeline
├── User Roles: Patient, Caregiver, Clinician & Family Journey Cards
├── AI Engine Flow: Activity -> Signals -> Personalization -> Recommendation
├── Accessibility Matrix: Multilingual, Large Text, High Contrast, Reduced Motion
├── Security & Privacy: DPDP Act 2023, On-Device AES-256 Vault
├── Final CTA: "Care becomes stronger when everything connects"
└── Marketing Footer: 3-Column Site Directory, Language Switcher & Legal links

04 — Public Landing — Tablet (768–1024px)
├── Collapsed Marketing Header with Hamburger menu
├── Responsive 2-column Feature Grid
└── Touch-optimized 3D spatial canvas

05 — Public Landing — Mobile (375–430px)
├── Single-column stacked layouts
├── Touch-first CTAs (minimum 56px height)
└── 2D Fallback Spatial Grid for high-speed mobile loading

06 — Authentication Flow
├── 06.1 — Login Modal (Email + Password, Forgot Password, Demo Quick-Login Chips)
├── 06.2 — Sign Up Modal (Full Name, Email, Password, Terms agreement)
├── 06.3 — Forgot Password Screen (Email input + Dispatched state)
├── 06.4 — OTP / Email Verification (6-Digit auto-advancing input fields)
└── 06.5 — Role Selection Portal (Patient, Caregiver, Clinician, System Admin)

07 — Patient Dashboard (Desktop 1440px)
├── Dashboard Shell: Consistent Sidebar + Top Header (Search, Voice AI, Profile)
├── Today's Progress: 80% Daily Goal Radial Progress & Active Streak Card
├── Today's Activities: Memory Bloom, Tea Sorting, Rhythm Match, Relaxation
└── Quick Actions: Start Activity, View Routine, Open Memories, Call Family

08 — Patient Mobile (375–430px)
├── Fixed Bottom Navigation: Home, Activities, Routine, Memories, Family
└── Large Tactile Cards with high-contrast audio greeting

09 — Caregiver Dashboard (Desktop 1440px)
├── Patient Status Cards (Dhiren Borah - Mild Cognitive Impairment)
├── Today's Routine Compliance (92% Adherence, Morning Water Logged)
├── Missed Window & Inactivity Alert Center
└── Direct Voice Note & Family Tele-Appointment Dispatch

10 — Caregiver Mobile (375–430px)
├── Mobile Bottom Navigation: Overview, Patients, Alerts, Routine, Settings
└── Push Notification simulation card

11 — Clinician Dashboard (Desktop 1440px)
├── 30-Day Longitudinal MoCA & MMSE Trajectory Trend Area Charts
├── Active Patient Cohort Table (Stage, Last Active, Response Latency)
└── One-Click FHIR / ABDM Compliant Clinical Summary Export

12 — Clinician Mobile (375–430px)
├── Mobile Patient List with quick-filter chips
└── Summary Telemetry Cards

13 — Admin Dashboard (Desktop 1440px)
├── System Health KPI Stat Cards (Total Users, Edge Sync Latency, DB Health)
├── User Management Table (Search, Filter, Role, Status, Edit, Disable, Delete)
├── Destructive Action Confirmation Modal
└── Content & Dialect Model Management Panel

14 — Admin Mobile (375–430px)
├── Compact system health monitor
└── Card-transformed user management list

15 — Feature Screens
├── 15.1 — Active Activity Player (Pause, Next, Completion Screen, Score & Encouragement)
├── 15.2 — Daily Routine Timeline (Morning, Afternoon, Evening cards)
├── 15.3 — Memory Garden (Photo Blossom Carousel, Story Player, Add Memory Modal)
└── 15.4 — Family Connect Hub (Photo Speed-Dial, Asynchronous Voice Notes)

16 — Components Library (Auto Layout)
├── Buttons (Primary, Secondary, Tertiary, Danger, Loading, Disabled)
├── Form Inputs (Default, Focused, Error, Success, Password, Search)
├── Cards (FeatureCard, PatientCard, StatCard, ActivityCard, RoutineCard)
├── Modals & Drawers (ConfirmationModal, VoiceAssistantDrawer, AccessibilityDrawer)
└── Badges, Tooltips, Empty States, Loading Skeletons & Error Banners

17 — Prototype Interactive Flows
├── Flow 1: Public Marketing -> Sign Up -> Role Selection -> Patient Dashboard
├── Flow 2: Patient Dashboard -> Start Activity -> Complete -> Progress Update
├── Flow 3: Caregiver -> View Patient -> Add Reminder -> Dispatch Voice Note
├── Flow 4: Clinician -> Inspect MoCA Curve -> Export FHIR Report
└── Flow 5: Admin -> Search User -> Edit Role -> Confirm Disable User
```

---

## 🔄 Prototype Interaction Connections

```
[ Public Landing Page ]
          │
      (Login / Get Started)
          ▼
   [ Auth Modal Flow ]
   ├── Login / SignUp
   ├── OTP Verification
   └── Role Selection
          │
          ├──────────────────────────┬─────────────────────────┬────────────────────────┐
          ▼                          ▼                         ▼                        ▼
[ Patient Dashboard ]      [ Caregiver Portal ]      [ Clinician Dome ]      [ Admin Console ]
├── Activities Player      ├── Patient Telemetry     ├── MoCA Trajectories   ├── User Management
├── Routine Schedule       ├── Missed Med Alerts     ├── MMSE Curves         ├── Content Editor
├── Memory Garden          └── Voice Notes           └── FHIR Export         └── System Telemetry
└── Family Connect
```
