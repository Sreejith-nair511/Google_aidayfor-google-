🌆 CityPulse AI

CityPulse AI is a modern, AI-enhanced urban analytics and civic engagement platform designed for smarter cities. It features dynamic map views, analytics dashboards, and AI integrations, including the **Tere Femini** module focused on gender-inclusive urban planning.

<h3>Still work in progress</h3>
<h4>made specifically for mboile might have issue with pc </h4>
## 🚀 Features

- 🧠 **Tere Femini AI Integration**: Custom-trained AI model that analyzes urban safety, accessibility, and gender equity in city design and infrastructure.
- 🗺️ Interactive city map with live component rendering.
- 📊 Modular dashboard UI (charts, calendars, cards, dialogs).
- 🧩 Built with fully reusable components using ShadCN and Tailwind UI.
- 🌐 Fully responsive and mobile-friendly interface.
- ⚙️ TypeScript-first with modular architecture.

## 🛠️ Tech Stack

| Layer         | Technology                |
|---------------|---------------------------|
| Frontend      | Next.js (App Router)      |
| UI Framework  | Tailwind CSS + ShadCN UI  |
| Language      | TypeScript                |
| State/UI      | React Hooks               |
| Styling       | PostCSS, CSS Modules      |
| Package Mgmt  | PNPM                      |

## 🤖 Tere Femini Module

The `Tere Femini` AI is a custom-trained model that offers insights on:
- **Women’s safety hotspots** based on crowdsourced data.
- **Inclusive design recommendations** for public spaces.
- **Sentiment analysis** from public feedback.
- Can be integrated with city APIs, citizen reports, or IOT sensor data.

> Coming soon: Voice interaction, multilingual support, and predictive alerting.

## 📁 Project Structure

citypulse-ai/
├── app/ # App pages and layout
├── components/ # Reusable UI components
├── hooks/ # Custom React hooks
├── lib/ # Utility functions
├── public/ # Static assets
├── styles/ # Global styles
├── tailwind.config.ts # TailwindCSS config
└── tsconfig.json # TypeScript config


demo prototype
https://city-pulse-ai.vercel.app/
![image](https://github.com/user-attachments/assets/40d965f8-1ed1-480c-a118-3290f60d415f)




## 📦 Installation & Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Run the development server
pnpm dev

# 3. Open in browser
http://localhost:3000
Note: If you're using npm instead of pnpm, switch to npm install and npm run dev.

🌍 Deployment
Deploy on Vercel for best integration with Next.js:


# After pushing to GitHub:
vercel deploy
🧪 Testing & Extending
Create new components under components/ui/.

For AI integrations, use APIs in lib/ or create new utility hooks in hooks/.

Add map data visualizations in app/components/map.tsx.




🙌 Contributors
Made with ❤️ by the CityPulse team.

📄 License
This project is licensed under the MIT License.
