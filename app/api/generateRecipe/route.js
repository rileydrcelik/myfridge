import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is correctly set in your environment variables
});

export async function POST(req) {
  try {
    // Parse the request body to get ingredients
    const { ingredients } = await req.json();
    console.log("Ingredients received:", ingredients);

    const ingredientNames = ingredients.map(ingredient => ingredient.name);
    console.log("Ingredient names:", ingredientNames);

    // Create the prompt for the OpenAI API
    const prompt = `Suggest a recipe I can make with the following ingredients: ${ingredientNames.join(', ')}`;
    console.log("Prompt:", prompt);
    // Call the OpenAI API to generate a recipe suggestion
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });
    console.log("OpenAI API response:", response.choices);

    // Extract the text from the API response
    const recipeSuggestions = response.choices[0].message.content.trim();

    // Return the suggestions as plain text
    return new NextResponse(recipeSuggestions, { status: 200 });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return new NextResponse('Failed to generate recipe', { status: 500 });
  }
}
