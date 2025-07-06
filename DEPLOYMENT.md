# Deployment Guide - DOCX Chapter Splitter

This guide provides step-by-step instructions for deploying your DOCX Chapter Splitter application on various free platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

Railway offers the simplest deployment experience with automatic detection of your Flask app.

1. **Fork/Upload Your Code**
   - Fork this repository to your GitHub account
   - Or create a new repository and upload all the files

2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "Deploy from GitHub repo"
   - Select your repository

3. **Deploy**
   - Railway automatically detects the Python app
   - It will install dependencies and start the server
   - Your app will be live in ~2 minutes!

4. **Access Your App**
   - Railway provides a public URL like `https://your-app.railway.app`
   - Your frontend will automatically connect to the backend

### Option 2: Render

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your forked repository

3. **Configure Settings**
   ```
   Name: docx-chapter-splitter
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option 3: Heroku

1. **Create Account**
   - Go to [heroku.com](https://heroku.com)
   - Sign up for free account

2. **Install Heroku CLI** (optional)
   ```bash
   # On Ubuntu/Debian
   sudo snap install heroku --classic
   ```

3. **Deploy via Web Dashboard**
   - Create new app in Heroku dashboard
   - Connect to GitHub
   - Select your repository
   - Enable automatic deploys

### Option 4: PythonAnywhere

1. **Create Free Account**
   - Go to [pythonanywhere.com](https://pythonanywhere.com)
   - Sign up for free "Beginner" account

2. **Upload Files**
   - Use the Files tab to upload your project
   - Or clone from GitHub in a console

3. **Create Web App**
   - Go to Web tab
   - Create new web app
   - Choose Python 3.11
   - Set source code directory to your project folder

4. **Configure WSGI**
   - Edit the WSGI configuration file
   - Point it to your `app.py` file

## 🛠️ Local Development

### Prerequisites
- Python 3.9 or higher
- pip package manager

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd docx-chapter-splitter
   ```

2. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   ```bash
   python app.py
   ```

5. **Open Your Browser**
   - Navigate to `http://localhost:5000`
   - The frontend will automatically connect to the local backend

## 🔧 Configuration

### Environment Variables

For production deployment, you may want to set these environment variables:

```bash
PORT=5000                    # Port for the application
FLASK_ENV=production         # Flask environment
```

### Frontend Configuration

The frontend automatically detects whether it's running locally or in production:

- **Local**: Connects to `http://localhost:5000`
- **Production**: Connects to the same domain as the frontend

If you need to override this, edit the `API_URL` in `index.html`:

```javascript
const API_URL = 'https://your-backend-url.com';
```

## 📁 File Structure

```
docx-chapter-splitter/
├── app.py              # Flask backend application
├── index.html          # Frontend single-page application
├── requirements.txt    # Python dependencies
├── Procfile           # Heroku/Railway deployment config
├── runtime.txt        # Python version specification
├── vercel.json        # Vercel deployment config
├── README.md          # Project documentation
└── DEPLOYMENT.md      # This deployment guide
```

## 🌐 Domain and HTTPS

Most platforms provide:
- Free subdomain (e.g., `your-app.railway.app`)
- Automatic HTTPS certificate
- CDN for faster loading

### Custom Domain (Optional)

If you want to use your own domain:

1. **Railway**: Go to Settings → Domains → Add custom domain
2. **Render**: Go to Settings → Custom Domains
3. **Heroku**: Go to Settings → Domains → Add domain

## 🐛 Troubleshooting

### Common Issues

1. **"Application Error" or "Internal Server Error"**
   - Check the logs in your platform's dashboard
   - Ensure all dependencies are in `requirements.txt`
   - Verify Python version compatibility

2. **Frontend Can't Connect to Backend**
   - Check if the `API_URL` is correct in `index.html`
   - Ensure CORS is enabled (already configured in `app.py`)

3. **Large File Upload Issues**
   - Most free platforms have file size limits (10-50MB)
   - Consider adding file size validation in frontend

4. **Slow Performance**
   - Free tier limitations are normal
   - Consider upgrading to paid plans for better performance

### Platform-Specific Issues

**Railway:**
- If deployment fails, check the build logs
- Ensure `Procfile` exists and is correctly formatted

**Render:**
- Free tier has limitations (512MB RAM, sleeps after inactivity)
- Check the service logs for specific error messages

**Heroku:**
- Free dynos sleep after 30 minutes of inactivity
- First request after sleep will be slower

## 📊 Performance Optimization

### For Production Use

1. **Add File Size Limits**
   ```python
   app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
   ```

2. **Add Caching**
   ```python
   from flask_caching import Cache
   cache = Cache(app)
   ```

3. **Error Logging**
   ```python
   import logging
   logging.basicConfig(level=logging.INFO)
   ```

4. **Database for Large Scale**
   - Consider adding PostgreSQL for storing processing results
   - Use Redis for caching frequently accessed data

## 🔐 Security Considerations

For production deployment:

1. **Set Secret Key**
   ```python
   app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key')
   ```

2. **Add Rate Limiting**
   ```python
   from flask_limiter import Limiter
   limiter = Limiter(app)
   ```

3. **Input Validation**
   - Already implemented basic validation
   - Consider adding more strict file type checking

## 📈 Monitoring

Most platforms provide:
- Application logs
- Performance metrics
- Error tracking
- Uptime monitoring

Check your platform's dashboard for these features.

## 💡 Tips for Success

1. **Test Locally First**: Always test your application locally before deploying
2. **Small Files First**: Test with small DOCX files initially
3. **Monitor Logs**: Keep an eye on application logs during initial deployment
4. **Gradual Scaling**: Start with free tiers and upgrade as needed
5. **Backup**: Keep your code in version control (GitHub)

## 🆘 Getting Help

If you encounter issues:

1. Check the platform-specific documentation
2. Look at the application logs for error messages
3. Test the API endpoints directly using curl or Postman
4. Verify that the frontend can access the backend APIs

## 🎉 Success!

Once deployed, your application will be accessible worldwide and can:
- Process DOCX files up to the platform's size limits
- Split documents into chapters automatically
- Generate downloadable DOCX files
- Work on any modern web browser
- Handle multiple users simultaneously

Your users can now upload DOCX files, define chapter titles, and get properly split documents with original formatting preserved!