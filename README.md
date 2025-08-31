# Smart-Recipe-Generator-5

This is a web application that uses generative AI to create custom recipes based on ingredients you have on hand. Simply snap a picture of your ingredients, and the app will recognize them and generate a unique recipe for you.


## How It Works

The application follows a simple, user-friendly workflow:

1.  **Upload a Photo**: The user is prompted to upload an image of their available ingredients. This could be a picture of items on a countertop or inside a refrigerator.
2.  **AI Ingredient Recognition**: The application sends the image to a generative AI model which analyzes the photo and returns a list of recognized ingredients.
3.  **Select Dietary Preferences**: The user can optionally select from a list of common dietary preferences, such as "Vegetarian" or "Gluten-Free".
4.  **AI Recipe Generation**: With the list of ingredients and any selected preferences, the app calls another AI model to generate a complete recipe, including a creative name, a formatted ingredient list, and step-by-step cooking instructions.
5.  **Display and Rate**: The final recipe is displayed in a clean, easy-to-read format. The user can then rate the recipe, and their rating is saved in their browser's local storage for future reference.

## Key Features

-   **Image-to-Ingredients**: Utilizes a vision-language model to identify food items from a user-provided image.
-   **Custom Recipe Generation**: Creates unique recipes tailored to the recognized ingredients and user's dietary needs.
-   **Interactive UI**: A modern, responsive interface built with Next.js and ShadCN UI components.
-   **Client-Side Rating**: Allows users to rate recipes, with ratings persisted in local storage.

## Tech Stack

This project is built with a modern, full-stack TypeScript setup:

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) (with Google Gemini models)
-   **UI**: [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

To run this project locally, you'll need to have Node.js and npm installed. You will also need a Google AI API key.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-recipe-generator.git
cd smart-recipe-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add your Google AI API key:

```
GEMINI_API_KEY=your_google_ai_api_key_here
```

### 4. Run the Development Server

You can run the full application with one command:

```bash
npm run dev
```

This will start the Next.js frontend on `http://localhost:9002`.

You can now open your browser and navigate to the address to start using the Smart Recipe Generator.
