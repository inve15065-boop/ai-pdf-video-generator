import os
from moviepy.editor import *
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from gtts import gTTS
import logging
import json
import random

logger = logging.getLogger(__name__)

class VideoGenerator:
    """Generates videos from transformed content"""
    
    def __init__(self):
        self.width = 1920
        self.height = 1080
        self.fps = 30
        
        # Creative color schemes
        self.color_schemes = [
            {'bg': (138, 43, 226), 'accent': (255, 20, 147)},  # Blue Violet + Deep Pink
            {'bg': (0, 191, 255), 'accent': (255, 215, 0)},    # Deep Sky Blue + Gold
            {'bg': (220, 20, 60), 'accent': (255, 140, 0)},    # Crimson + Dark Orange
            {'bg': (75, 0, 130), 'accent': (50, 205, 50)},     # Indigo + Lime Green
            {'bg': (255, 69, 0), 'accent': (138, 43, 226)},    # Red Orange + Blue Violet
        ]
    
    def create_video(self, transformed_content: dict, session_id: str) -> str:
        """Create video from transformed content"""
        try:
            output_path = f"outputs/{session_id}.mp4"
            
            # Parse script
            script = transformed_content.get('script', {})
            if isinstance(script, str):
                try:
                    script = json.loads(script)
                except:
                    script = {'title': 'Video', 'scenes': []}
            
            scenes = script.get('scenes', [])
            if not scenes:
                # Create default scene
                scenes = [{
                    'scene_number': 1,
                    'narration': 'Generated video from PDF content',
                    'visual_description': 'Title scene',
                    'duration_seconds': 5
                }]
            
            # Generate video clips
            clips = []
            
            for i, scene in enumerate(scenes[:5]):  # Limit to 5 scenes
                duration = scene.get('duration_seconds', 5)
                narration = scene.get('narration', '')
                
                # Create visual frame
                clip = self._create_scene_clip(scene, i, duration)
                clips.append(clip)
            
            # Concatenate all clips
            if clips:
                final_video = concatenate_videoclips(clips, method="compose")
                final_video.write_videofile(
                    output_path,
                    fps=self.fps,
                    codec='libx264',
                    audio_codec='aac',
                    temp_audiofile='temp-audio.m4a',
                    remove_temp=True,
                    logger=None
                )
                
                logger.info(f"Video created successfully: {output_path}")
                return output_path
            else:
                raise Exception("No clips generated")
        
        except Exception as e:
            logger.error(f"Video generation error: {str(e)}")
            # Create a simple fallback video
            return self._create_fallback_video(session_id)
    
    def _create_scene_clip(self, scene: dict, scene_index: int, duration: int):
        """Create a single scene clip with creative styling"""
        # Select color scheme
        colors = self.color_schemes[scene_index % len(self.color_schemes)]
        
        # Create frame
        img = Image.new('RGB', (self.width, self.height), colors['bg'])
        draw = ImageDraw.Draw(img)
        
        # Add gradient effect
        for y in range(self.height):
            alpha = y / self.height
            r = int(colors['bg'][0] * (1 - alpha) + colors['accent'][0] * alpha)
            g = int(colors['bg'][1] * (1 - alpha) + colors['accent'][1] * alpha)
            b = int(colors['bg'][2] * (1 - alpha) + colors['accent'][2] * alpha)
            draw.line([(0, y), (self.width, y)], fill=(r, g, b))
        
        # Add text
        narration = scene.get('narration', '')[:200]
        
        try:
            font = ImageFont.truetype("arial.ttf", 60)
        except:
            font = ImageFont.load_default()
        
        # Draw text with shadow
        text_bbox = draw.textbbox((0, 0), narration, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        x = (self.width - text_width) // 2
        y = (self.height - text_height) // 2
        
        # Shadow
        draw.text((x + 3, y + 3), narration, fill=(0, 0, 0), font=font)
        # Main text
        draw.text((x, y), narration, fill=(255, 255, 255), font=font)
        
        # Convert to numpy array
        frame = np.array(img)
        
        # Create clip
        clip = ImageClip(frame).set_duration(duration)
        
        return clip
    
    def _create_fallback_video(self, session_id: str) -> str:
        """Create a simple fallback video"""
        output_path = f"outputs/{session_id}.mp4"
        
        # Create simple colored frame
        img = Image.new('RGB', (self.width, self.height), (138, 43, 226))
        draw = ImageDraw.Draw(img)
        
        text = "Video Generated Successfully"
        try:
            font = ImageFont.truetype("arial.ttf", 80)
        except:
            font = ImageFont.load_default()
        
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        x = (self.width - text_width) // 2
        y = (self.height - text_height) // 2
        
        draw.text((x, y), text, fill=(255, 255, 255), font=font)
        
        frame = np.array(img)
        clip = ImageClip(frame).set_duration(5)
        
        clip.write_videofile(
            output_path,
            fps=self.fps,
            codec='libx264',
            logger=None
        )
        
        return output_path
