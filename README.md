# 🚀 Smart Library Platform [V2-PRO]
### Mechatronics Engineering - Batch 12 | Sana'a University

An advanced, responsive, and secure full-stack Web Application built to streamline academic resource sharing for Mechatronics Engineering students (Batch 12). This platform acts as a high-performance central hub, seamlessly blending local server capabilities with immense cloud storage to serve lectures, heavy video tutorials, and technical data sheets without crashing or bandwidth limitations.

---

## 🌍 System Architecture Overview
The platform uses a hybrid dual-storage architecture to optimize server load and network bandwidth:
1. **Core Web Server (Node.js & Express):** Handles routing, the user interface, real-time device tracking, the administration panel, and access control lists.
2. **Heavy-Media Cloud Engine (Google Drive 2TB Integration):** Large files (e.g., Embedded Systems, CNC simulation videos, MATLAB packages) are mapped dynamically to a high-capacity 2 Terabyte academic Google Drive storage, routing downloads through Google’s global content delivery network to eliminate upstream bottlenecks on the host machine.

---

## ✨ Key Features

### 👥 Student & User Interface
* **Hierarchical Tree-Browsing:** Smooth navigation through nested subfolders and academic modules without page reloads.
* **Dual Download Streams:** Options to stream/download files directly from the local server directory or offload directly via Google Drive cloud links.
* **Live Connection Tracker:** An automated session uptime clock calculating exactly how long the client device has been connected to the active server.
* **Fully Responsive UI:** Crafted with a premium modern dark theme that scales gracefully across smartphones, tablets, and desktop computers.

### 🛡️ Administration & Security Control Panel
* **Protected Authorization:** Secure admin gate prohibiting unauthorized access to destructive operations.
* **Dynamic File Manager:** Ability to upload entire directories or delete obsolete files and folders directly from the web panel in real-time.
* **Live Client Session Monitor:** Inspects all connected remote nodes, displaying their clean IPv4/IPv6 addresses along with their precise interaction duration.
* **Hardware Kick/Ban Firewall System:** Empowering the admin to instantaneously disconnect any suspicious node and push its IP address into a strict blacklist, blocking further access with a `403 Forbidden` wall.

---

## 🛠️ Technical Stack

* **Frontend:** Semantic HTML5, Advanced CSS3 Grid/Flexbox Layouts, Vanillajs (Asynchronous Fetch API).
* **Backend:** Node.js, Express.js framework.
* **File Processing:** Multer Middleware (Multi-part form data processing Engine).
* **Environment Configuration:** Cloud-ready cross-platform environment bindings.

---

## 📂 Project Directory Structure

```text
Mecha-Smart-Library/
├── library/                 # Local media and materials root directory
├── node_modules/            # Node.js dependencies (Omitted via .gitignore)
├── committee.jpg            # Mechatronics Batch 12 Department Logo
├── eng.png                  # Faculty of Engineering Emblem
├── index.html               # Main Single-Page Application Layout
├── package.json             # Project metadata and dependencies manifest
├── package-lock.json        # Strict dependency tree lockfile
├── README.md                # Documentation profile (This file)
├── Run_Library.bat          # Automated localized startup script
└── server.js                # Core backend script & firewall middleware