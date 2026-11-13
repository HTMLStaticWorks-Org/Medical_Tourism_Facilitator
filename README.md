# Aurelia Global Health — Medical Tourism Facilitator Website Template

A complete, responsive, ThemeForest & Creative Market standard website template designed for **International Medical Tourism Facilitators, Cross-Border Patient Coordination Agencies, and Global Healthcare Concierge Networks**.

---

## 1. Project Structure

```text
Medical_Tourism_Facilitator/
├── index.html          # Home 1 — Global Medical Tourism Flagship Homepage
├── home-2.html         # Home 2 — Editorial Network & Pathway Finder Homepage
├── about.html          # Company Introduction, Mission, Transparency & Sample Team Profiles
├── treatments.html     # Treatments Discovery Directory (10 Medical Categories + Filtering)
├── hospitals.html      # Partner Hospitals Directory (8 Sample Facilities + Country/Specialty Filtering)
├── process.html        # 7-Stage Step-by-Step Patient Journey & Role Distinction Matrix
├── contact.html        # International Patient Enquiry Form, Interactive Map & Social Channels
├── dashboard.html      # Patient Dashboard (Submitting Reports, Tracking Treatment Plans, Travel Itineraries)
├── login.html          # Branded Clean Patient Access Sign-In Card (Google & Apple Auth UI)
├── signup.html         # Branded Patient Registration UI (Single-Column Inputs, Google & Apple Auth)
├── README.md           # Buyer Customization & Technical Documentation
└── assets/
    ├── css/
    │   └── styles.css  # CSS Design System (Light/Dark Theme, RTL, 1024px Responsive Card Grids)
    ├── js/
    │   ├── data.js     # Centralized Editable Sample Hospital & Treatment Category Data
    │   └── main.js     # Navigation, Theme Toggle, RTL Toggle, Live Filtering, Modals & Validation
    └── images/
        └── favicon.svg # Exact Shield-Cross Brandmark Favicon
```

---

## 2. Customizing Brand Colors, Typography & Spacing

Open [`assets/css/styles.css`](assets/css/styles.css) and edit the CSS custom properties inside `:root, [data-theme="light"]` and `[data-theme="dark"]`:

- **Primary Palette**:
  - `--color-navy-900`: `#0B192C` (Deep Navy)
  - `--color-blue-600`: `#2563EB` (Soft Medical Blue)
  - `--color-teal-600`: `#1D6F72` (Muted Teal)
  - `--color-champagne-500`: `#C5A880` (Subtle Champagne Accent)
- **Typography**:
  - `--font-sans`: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
  - `--font-serif`: `'Cormorant Garamond', Georgia, serif`
- **Spacing Scale**:
  - Uses a strict 4px/8px scale (`--space-1` = `4px` through `--space-24` = `96px`).

---

## 3. Replacing Fictional Sample Partner Hospitals & Treatments

All hospital profiles, patient testimonials, and team profiles are clearly marked as **Fictional Sample Demonstration Content** so buyers never accidentally publish unverified medical claims.

To replace the sample hospital directory or update treatment categories:
1. Open [`assets/js/data.js`](assets/js/data.js).
2. In `window.AURELIA_DATA.hospitals`, update each hospital object:
   - `id`: Unique URL-safe identifier
   - `name`: Verified partner hospital name
   - `sampleBadge`: Badge label (e.g., `"Verified Partner"` once authorized)
   - `city`, `country`, `region`: Location metadata used by the live filters
   - `specialties`: Array of medical specialties offered
   - `image`: Path to local or hosted facility photograph
   - `shortIntro` & `overview`: Card summary and modal overview text
   - `facilities` & `languages`: Bullet lists displayed in the Hospital Details Modal
3. Featured cards on `index.html` and `home-2.html` can also be edited directly in HTML and linked to any hospital `id` via `data-hospital-modal="<id>"`.

---

## 4. Ethical & Healthcare Compliance Guardrails Built In

- **Facilitator vs. Hospital Role Clarity**: Dedicated notices and comparison matrices on `process.html`, `about.html`, and the global footer clearly state that the facilitator coordinates logistics while licensed hospital clinicians make all medical decisions.
- **Educational Treatment Descriptions**: All 10 treatment categories on `treatments.html` avoid outcome promises, guaranteed recovery claims, or unsupported success rates.
- **Medical Document Privacy**: `contact.html` explicitly instructs patients not to upload sensitive clinical records through public web forms, directing them instead to encrypted hospital transfer channels after initial verification.
- **Frontend Auth UI Only**: `login.html` and `signup.html` provide complete client-side validation and interactive UI states without storing personal health information.

