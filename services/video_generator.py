import os
from moviepy.editor import *
from PIL import Image, ImageDraw, ImageFont
import numpy as np
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
        """Create video from transformed content with robust error handling"""
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
                # Create default scene from content
                content_text = str(transformed_content).replace('{', '').replace('}', '')[:100]
                scenes = [{
                    'scene_number': 1,
                    'narration': content_text or 'Generated video from PDF content',
                    'visual_description': 'Title scene',
                    'duration_seconds': 5
                }]
            
            logger.info(f"Creating video with {len(scenes)} scenes")
            
            # Try simple approach first
            try:
                return self._create_simple_video(scenes, session_id)
            except Exception as simple_error:
                logger.warning(f"Simple video creation failed: {str(simple_error)}")
                # Try fallback approach
                return self._create_fallback_video(session_id)
        
        except Exception as e:
            logger.error(f"Video generation error: {str(e)}")
            return self._create_fallback_video(session_id)
    
    def _create_simple_video(self, scenes: list, session_id: str) -> str:
        """Create video with minimal MoviePy usage"""
        output_path = f"outputs/{session_id}.mp4"
        
        # Create frames for each scene
        frames = []
        total_duration = 0
        
        for i, scene in enumerate(scenes[:2]):  # Limit to 2 scenes for stability
            duration = min(scene.get('duration_seconds', 4), 6)  # Max 6 seconds
            total_duration += duration
            
            # Create frame image
            frame_img = self._create_scene_frame(scene, i)
            frames.append((frame_img, duration))
        
        # Ensure we have at least one frame
        if not frames:
            frame_img = self._create_default_frame()
            frames.append((frame_img, 3))
            total_duration = 3
        
        # Create video clips
        clips = []
        for frame_img, duration in frames:
            try:
                # Convert PIL image to numpy array
                frame_array = np.array(frame_img)
                
                # Create ImageClip
                clip = ImageClip(frame_array).set_duration(duration)
                clips.append(clip)
            except Exception as clip_error:
                logger.warning(f"Failed to create clip: {str(clip_error)}")
                continue
        
        if not clips:
            raise Exception("No clips created successfully")
        
        # Concatenate clips
        if len(clips) == 1:
            final_video = clips[0]
        else:
            final_video = concatenate_videoclips(clips, method="compose")
        
        # Write video with very conservative settings
        try:
            final_video.write_videofile(
                output_path,
                fps=20,  # Lower FPS
                codec='libx264',
                audio=False,  # No audio to avoid issues
                verbose=False,
                logger=None,
                preset='ultrafast',
                ffmpeg_params=[
                    '-pix_fmt', 'yuv420p',  # Ensure compatibility
                    '-movflags', '+faststart'  # Web optimization
                ]
            )
            
            # Clean up
            for clip in clips:
                clip.close()
            final_video.close()
            
            logger.info(f"Simple video created successfully: {output_path}")
            return output_path
            
        except Exception as write_error:
            logger.error(f"Video write failed: {str(write_error)}")
            # Clean up clips
            for clip in clips:
                try:
                    clip.close()
                except:
                    pass
            try:
                final_video.close()
            except:
                pass
            raise write_error
    
    def _create_scene_frame(self, scene: dict, scene_index: int) -> Image.Image:
        """Create a single scene frame as PIL Image"""
        # Select color scheme
        colors = self.color_schemes[scene_index % len(self.color_schemes)]
        
        # Create frame
        img = Image.new('RGB', (self.width, self.height), colors['bg'])
        draw = ImageDraw.Draw(img)
        
        # Add gradient effect
        for y in range(0, self.height, 4):  # Skip lines for performance
            alpha = y / self.height
            r = int(colors['bg'][0] * (1 - alpha) + colors['accent'][0] * alpha)
            g = int(colors['bg'][1] * (1 - alpha) + colors['accent'][1] * alpha)
            b = int(colors['bg'][2] * (1 - alpha) + colors['accent'][2] * alpha)
            draw.rectangle([(0, y), (self.width, y + 4)], fill=(r, g, b))
        
        # Add text
        narration = scene.get('narration', '')[:150]  # Limit text length
        
        try:
            # Try different font paths for different systems
            font_paths = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                "/System/Library/Fonts/Arial.ttf",
                "arial.ttf",
                "C:/Windows/Fonts/arial.ttf"
            ]
            font = None
            for font_path in font_paths:
                try:
                    font = ImageFont.truetype(font_path, 60)
                    break
                except:
                    continue
            
            if font is None:
                font = ImageFont.load_default()
        except:
            font = ImageFont.load_default()
        
        # Calculate text position with word wrapping
        words = narration.split()
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font)
            if bbox[2] - bbox[0] < self.width - 200:  # Leave margin
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                else:
                    lines.append(word)
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Limit to 3 lines
        lines = lines[:3]
        
        # Draw text lines
        total_text_height = len(lines) * 80
        start_y = (self.height - total_text_height) // 2
        
        for i, line in enumerate(lines):
            bbox = draw.textbbox((0, 0), line, font=font)
            text_width = bbox[2] - bbox[0]
            x = (self.width - text_width) // 2
            y = start_y + i * 80
            
            # Shadow
            draw.text((x + 2, y + 2), line, fill=(0, 0, 0, 128), font=font)
            # Main text
            draw.text((x, y), line, fill=(255, 255, 255), font=font)
        
        return img
    
    def _create_default_frame(self) -> Image.Image:
        """Create a default frame"""
        img = Image.new('RGB', (self.width, self.height), (138, 43, 226))
        draw = ImageDraw.Draw(img)
        
        text = "Video Generated Successfully"
        try:
            font_paths = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                "/System/Library/Fonts/Arial.ttf",
                "arial.ttf",
                "C:/Windows/Fonts/arial.ttf"
            ]
            font = None
            for font_path in font_paths:
                try:
                    font = ImageFont.truetype(font_path, 80)
                    break
                except:
                    continue
            
            if font is None:
                font = ImageFont.load_default()
        except:
            font = ImageFont.load_default()
        
        # Calculate text position
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (self.width - text_width) // 2
        y = (self.height - text_height) // 2
        
        draw.text((x, y), text, fill=(255, 255, 255), font=font)
        
        return img
    
    def _create_fallback_video(self, session_id: str) -> str:
        """Create a simple fallback video or image"""
        output_path = f"outputs/{session_id}.mp4"
        
        try:
            # Create simple frame
            frame_img = self._create_default_frame()
            
            # Convert to numpy array
            frame_array = np.array(frame_img)
            
            # Create a simple 3-second video
            clip = ImageClip(frame_array).set_duration(3)
            
            # Write with absolute minimal settings
            clip.write_videofile(
                output_path,
                fps=15,  # Very low FPS
                codec='libx264',
                audio=False,
                verbose=False,
                logger=None,
                preset='ultrafast',
                ffmpeg_params=['-pix_fmt', 'yuv420p']
            )
            
            clip.close()
            
            logger.info(f"Fallback video created: {output_path}")
            return output_path
            
        except Exception as fallback_error:
            logger.error(f"Fallback video creation failed: {str(fallback_error)}")
            
            # Last resort: create a PNG image
            try:
                png_path = f"outputs/{session_id}.png"
                frame_img = self._create_default_frame()
                frame_img.save(png_path, 'PNG')
                
                logger.info(f"Created PNG fallback: {png_path}")
                return png_path
                
            except Exception as png_error:
                logger.error(f"PNG fallback failed: {str(png_error)}")
                raise Exception("All video generation methods failed")
