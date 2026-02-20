import PyPDF2
import os
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class PDFProcessor:
    """Handles PDF content extraction"""
    
    def extract_content(self, pdf_path: str) -> Dict:
        """Extract text and metadata from PDF"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                # Extract metadata
                metadata = {
                    'num_pages': len(pdf_reader.pages),
                    'title': pdf_reader.metadata.title if pdf_reader.metadata else 'Untitled',
                }
                
                # Extract text from all pages
                text_content = []
                for page_num, page in enumerate(pdf_reader.pages):
                    text = page.extract_text()
                    if text.strip():
                        text_content.append({
                            'page': page_num + 1,
                            'text': text.strip()
                        })
                
                logger.info(f"Extracted {len(text_content)} pages from PDF")
                
                return {
                    'metadata': metadata,
                    'content': text_content,
                    'total_text': ' '.join([p['text'] for p in text_content])
                }
        
        except Exception as e:
            logger.error(f"PDF extraction error: {str(e)}")
            raise Exception(f"Failed to extract PDF content: {str(e)}")
