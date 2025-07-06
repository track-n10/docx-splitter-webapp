# DOCX Chapter Splitter - Vercel Edition

A client-side web application for splitting DOCX documents into chapters. All processing happens in your browser - your documents never leave your computer!

## Features

- ✅ Upload DOCX files via drag & drop or file picker  
- ✅ Split documents based on chapter titles/summaries
- ✅ Download individual chapters as HTML files
- ✅ Copy chapter content to clipboard
- ✅ Preview chapters in the browser
- ✅ Responsive design with modern UI
- ✅ 100% client-side processing (privacy-focused)
- ✅ Completely free to deploy and use

## How It Works

1. **Upload**: Select or drag & drop a DOCX file
2. **Define Chapters**: Enter chapter titles (one per line) 
3. **Process**: The app intelligently splits the document
4. **Download**: Get individual DOCX files or a ZIP with all chapters

## Deployment Options (100% Free)

### Option 1: Railway (Recommended)

1. Fork this repository
2. Connect your GitHub to Railway
3. Deploy the repository
4. Railway will automatically detect the Python app and deploy it

### Option 2: Render

1. Fork this repository  
2. Connect to Render
3. Create a new Web Service
4. Connect your forked repository
5. Use these settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

### Option 3: Vercel (Frontend + Serverless Functions)

1. Fork this repository
2. Deploy to Vercel
3. The app will work with client-side processing

### Option 4: Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd docx-chapter-splitter

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py

# Open your browser to http://localhost:5000
```

## Technology Stack

**Backend:**
- Python Flask
- python-docx for DOCX processing
- Flask-CORS for cross-origin requests

**Frontend:**
- HTML5/CSS3/JavaScript
- Mammoth.js (fallback client-side processing)
- Modern responsive design

## File Structure

```
docx-chapter-splitter/
├── app.py              # Flask backend API
├── index.html          # Frontend application
├── requirements.txt    # Python dependencies
├── Procfile           # Deployment configuration
├── runtime.txt        # Python version specification
└── README.md          # This file
```

## API Endpoints

- `POST /api/split` - Split DOCX into chapters
- `POST /api/download_chapter` - Download single chapter as DOCX
- `POST /api/download_all` - Download all chapters as ZIP
- `GET /health` - Health check

## Usage Examples

### Chapter Titles Input:
```
Introdução
Capítulo 1: Fundamentos
Capítulo 2: Desenvolvimento
Capítulo 3: Implementação
Conclusão
```

### Smart Splitting Features:
- Automatically finds chapter breaks in the document
- Falls back to equal splitting if no breaks are found
- Preserves document formatting
- Handles various heading styles

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Troubleshooting

**Problem**: Server connection errors
**Solution**: The app automatically falls back to client-side processing

**Problem**: Large files not processing
**Solution**: Try splitting your document into smaller sections first

**Problem**: Chapter breaks not found
**Solution**: Ensure your chapter titles match the text in your document exactly

## Support

For issues or questions, please open an issue in the GitHub repository.