import os
from openai import OpenAI
import logging

logger = logging.getLogger(__name__)

class AITransformer:
    """Transforms PDF content using AI"""
    
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            logger.warning("OpenAI API key not found. AI features will be limited.")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key)
    
    def transform_content(self, extracted_content: dict, requirements: str) -> dict:
        """Transform extracted content based on user requirements"""
        try:
            if not self.client:
                # Fallback: Simple transformation without AI
                return self._simple_transform(extracted_content, requirements)
            
            text = extracted_content.get('total_text', '')
            
            # Create prompt for AI
            prompt = f"""Transform the following PDF content into a video script based on these requirements:
            
Requirements: {requirements}

PDF Content:
{text[:3000]}  # Limit to avoid token limits

Create a structured video script with:
1. An engaging introduction
2. Key points broken into scenes (3-5 scenes)
3. Visual descriptions for each scene
4. A compelling conclusion

Format as JSON with: title, scenes (each with: scene_number, narration, visual_description, duration_seconds)
"""
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional video script writer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            script_text = response.choices[0].message.content
            
            logger.info("AI transformation completed")
            
            return {
                'script': script_text,
                'source_pages': extracted_content.get('metadata', {}).get('num_pages', 0),
                'requirements': requirements
            }
        
        except Exception as e:
            logger.error(f"AI transformation error: {str(e)}")
            # Fallback to simple transformation
            return self._simple_transform(extracted_content, requirements)
    
    def _simple_transform(self, extracted_content: dict, requirements: str) -> dict:
        """Simple transformation without AI"""
        text = extracted_content.get('total_text', '')
        
        # Create basic scenes from content
        words = text.split()
        chunk_size = len(words) // 3 if len(words) > 100 else len(words)
        
        scenes = []
        for i in range(min(3, len(words) // chunk_size + 1)):
            start = i * chunk_size
            end = start + chunk_size
            chunk_text = ' '.join(words[start:end])
            
            scenes.append({
                'scene_number': i + 1,
                'narration': chunk_text[:200] + '...' if len(chunk_text) > 200 else chunk_text,
                'visual_description': f'Scene {i+1} visuals',
                'duration_seconds': 5
            })
        
        return {
            'script': {
                'title': extracted_content.get('metadata', {}).get('title', 'Video'),
                'scenes': scenes
            },
            'source_pages': extracted_content.get('metadata', {}).get('num_pages', 0),
            'requirements': requirements
        }
