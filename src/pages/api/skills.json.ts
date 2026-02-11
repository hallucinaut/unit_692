import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Pre-render this as a static JSON file for GitHub Pages
export const prerender = true;

export const GET: APIRoute = async () => {
  // Fetch all skills
  const allSkills = await getCollection('skills');

  // Return ALL skills data for client-side random selection
  const skillsData = allSkills.map(skill => ({
    id: skill.id,
    title: skill.data.title,
    description: skill.data.description,
    category: skill.data.category,
    url: `/skills/${skill.id}`,
  }));

  return new Response(
    JSON.stringify(skillsData),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
