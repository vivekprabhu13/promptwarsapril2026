# KrowdFlux 🏟️ | Challenge Submission

**KrowdFlux** is a smart, dynamic event companion designed to solve the "last mile" experience of attending large-scale sporting events. It transforms the chaotic environment of a stadium into a manageable, personalized, and social experience.

---

## 🎯 Chosen Vertical: Sports & Entertainment (Large Venue Management)

This solution focuses on the **Attendee Persona**—a fan who wants to maximize their time watching the game and minimize time spent in queues or navigating complex stadium layouts.

## 🧠 Approach and Logic

The core logic of KrowdFlux is built on **Contextual Intelligence**. The application doesn't just show data; it understands the user's specific situation:

1.  **Context Initialization**: The journey starts with a "Ticket-First" approach. Instead of manual entry, we use AI to ingest the user's context (Section, Seat, Gate) directly from their physical ticket.
2.  **Dynamic Decision Making**: The AI Assistant doesn't give generic advice. It combines the user's ticket data with real-time stadium metrics (crowd density, restroom wait times) to provide logical, actionable recommendations (e.g., "Don't go to the nearest restroom; walk 2 minutes further to Block 205 to save 10 minutes").
3.  **Social Coordination**: Recognizing that sports are social, the logic includes a "Friend Finder" layer, allowing users to coordinate movements without leaving the app.

## 🛠️ How the Solution Works

### 1. Smart Dynamic Assistant (Gemini Integration)
- **Ticket Extraction**: Uses **Gemini 3 Flash** to perform OCR and structured data extraction from uploaded ticket images. It identifies the match, venue, and seating details to bootstrap the user's profile.
- **Contextual Chat**: The assistant is fed a JSON "World State" (user location, stadium wait times, event status). This allows it to answer complex queries like "Where is the shortest beer line near my seat?" with high precision.

### 2. Live Venue Mapping
- **SVG Engine**: A custom-built, interactive SVG map of **Chinnaswamy Stadium**.
- **Personalized Markers**: Dynamically renders "Your Seat" based on ticket data and "Friend Locations" based on mock real-time feeds.
- **GPS Integration**: Uses the browser's Geolocation API to map the user's real-world coordinates onto the stadium's SVG coordinate system.

### 3. Real-World Usability
- **Traffic-Clearing UI**: A distinctive dark-mode interface with a symbolic **Red-to-Green gradient** branding, representing the flow from congestion to clarity.
- **Mobile-First Design**: Optimized for touch interactions, high-contrast visibility in stadium lighting, and quick-action buttons for common needs (Food, Restrooms, Exits).

## 📋 Assumptions Made

- **Stadium Model**: The application is currently modeled specifically for **M. Chinnaswamy Stadium, Bengaluru**, though the architecture is venue-agnostic.
- **Data Feeds**: Wait times and crowd density are currently driven by a sophisticated mock data engine (`mockData.ts`) that simulates real-time sensor inputs (IoT/Camera feeds).
- **Friend Privacy**: Assumes a "Circle of Friends" model where users have already opted into sharing location for the duration of the event.

## 🚀 Technical Implementation

- **Framework**: React 19 + Vite + TypeScript.
- **AI SDK**: `@google/genai` for Gemini 3 Flash integration.
- **Styling**: Tailwind CSS for utility-first, performant styling.
- **Animations**: `motion` for fluid, non-distracting UI transitions.
- **Icons**: Lucide React for a clean, universal iconography.

---

*KrowdFlux demonstrates how Google's Generative AI can be combined with traditional location services to solve real-world logistical challenges in the entertainment industry.*
