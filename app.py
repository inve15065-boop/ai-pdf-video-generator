from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv
from services.pdf_processor import PDFProcessor
from services.ai_transformer import AITransformer
from services.video_generator import VideoGenerator
import uuid
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
pdf_processor = PDFProcessor()
ai_transformer = AITransformer()
video_generator = VideoGenerator()

# Ensure directories exist
os.makedirs('uploads', exist_ok=True)
os.makedirs('outputs', exist_ok=True)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "AI PDF to Video Generator is running"})

@app.route('/upload', methods=['POST'])
def upload_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({"error": "No PDF file provided"}), 400
        
        pdf_file = request.files['pdf']
        user_requirements = request.form.get('requirements', '')
        
        if pdf_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Generate unique session ID
        session_id = str(uuid.uuid4())
        
        # Save uploaded file
        pdf_path = f"uploads/{session_id}.pdf"
        pdf_file.save(pdf_path)
        
        logger.info(f"PDF uploaded successfully: {session_id}")
        
        return jsonify({
            "session_id": session_id,
            "message": "PDF uploaded successfully",
            "requirements": user_requirements
        })
    
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/process/<session_id>', methods=['POST'])
def process_pdf(session_id):
    try:
        pdf_path = f"uploads/{session_id}.pdf"
        
        if not os.path.exists(pdf_path):
            return jsonify({"error": "PDF not found"}), 404
        
        # Get user requirements
        data = request.get_json()
        requirements = data.get('requirements', '')
        
        # Step 1: Extract content from PDF
        logger.info(f"Processing PDF: {session_id}")
        extracted_content = pdf_processor.extract_content(pdf_path)
        
        # Step 2: Transform content using AI
        logger.info(f"Transforming content with AI: {session_id}")
        transformed_content = ai_transformer.transform_content(
            extracted_content, 
            requirements
        )
        
        # Step 3: Generate video
        logger.info(f"Generating video: {session_id}")
        video_path = video_generator.create_video(
            transformed_content, 
            session_id
        )
        
        return jsonify({
            "session_id": session_id,
            "status": "completed",
            "video_path": video_path,
            "message": "Video generated successfully"
        })
    
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/download/<session_id>', methods=['GET'])
def download_video(session_id):
    try:
        video_path = f"outputs/{session_id}.mp4"
        
        if not os.path.exists(video_path):
            return jsonify({"error": "Video not found"}), 404
        
        return send_file(video_path, as_attachment=True, download_name=f"generated_video_{session_id}.mp4")
    
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/status/<session_id>', methods=['GET'])
def get_status(session_id):
    try:
        pdf_path = f"uploads/{session_id}.pdf"
        video_path = f"outputs/{session_id}.mp4"
        
        status = {
            "session_id": session_id,
            "pdf_uploaded": os.path.exists(pdf_path),
            "video_ready": os.path.exists(video_path)
        }
        
        return jsonify(status)
    
    except Exception as e:
        logger.error(f"Status error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)