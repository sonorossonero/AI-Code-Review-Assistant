# Code Review Assistant

A full-stack application that provides AI-powered code reviews using Claude AI. The application helps developers improve their code quality by providing detailed feedback, suggestions for improvements, and best practices.

Live Demo: [Frontend Demo](https://ai-code-review-assistant-frontend.vercel.app/)

## Features

- 🖥️ Interactive code editor with syntax highlighting
- 🎨 Dark/Light theme support
- 📝 Support for Python and JavaScript
- 🔄 Real-time code review feedback
- 📊 Review history tracking
- 📱 Responsive design for all devices
- 🔒 Basic authentication
- 💾 Review caching for efficiency

## Tech Stack

### Frontend

- React with Vite
- TailwindCSS for styling
- Monaco Editor for code editing
- Axios for API requests
- Shadcn UI components

### Backend

- FastAPI (Python)
- Anthropic Claude AI for code analysis
- Basic authentication
- Rate limiting
- Request caching

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (3.8 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/sonorossonero/AI-Code-Review-Assistant/
cd AI-Code-Review-Assistant
```

2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Create and configure your .env file
```

3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env  # Create and configure your .env file
```

### Environment Variables

#### Backend (.env)

```
ANTHROPIC_API_KEY=your_api_key_here
AUTH_USERNAME=admin
AUTH_PASSWORD=your_secure_password_here
ENVIRONMENT=development
```

#### Frontend (.env)

```
VITE_API_URL=http://localhost:8000
VITE_AUTH_USERNAME=admin
VITE_AUTH_PASSWORD=your_secure_password_here
```

### Running the Application

1. Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

2. Start the Frontend

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Usage

1. Open the application in your browser
2. Select your programming language (Python or JavaScript)
3. Paste or type your code in the editor
4. Click "Analyze Code" to get feedback
5. Review the AI-generated suggestions
6. Copy feedback or code as needed
7. Access previous reviews in the history section

## Deployment

The application is configured for deployment on Vercel.

1. Frontend Deployment

- Push your code to GitHub
- Import project in Vercel
- Configure environment variables
- Deploy

2. Backend Deployment

- Push your code to GitHub
- Import project in Vercel
- Configure environment variables
- Deploy

## URLs

- Frontend: https://ai-code-review-assistant-frontend.vercel.app/
- Backend: https://ai-code-review-assistant-backend.vercel.app/
- API Review Endpoint: https://ai-code-review-assistant-backend.vercel.app/api/review

## Limitations and Assumptions

1. Rate Limiting

- 10 requests per minute per IP
- Maximum code size: 10,000 characters

2. Language Support

- Currently supports only Python and JavaScript
- Syntax highlighting for supported languages only

3. Authentication

- Basic authentication implementation
- Single set of credentials for all users

4. Caching

- In-memory caching (not persistent)
- Cache size limited to 100 entries

## Future Improvements

1. Features

- User authentication with JWT
- Support for more programming languages
- Code formatting options
- Team collaboration features
- Persistent storage for review history
- Export reviews as PDF/markdown

2. Technical Improvements

- Database integration
- Advanced rate limiting
- Persistent caching solution
- WebSocket for real-time updates
- Unit and integration tests
- CI/CD pipeline

3. UI/UX Improvements

- Code diff viewer
- Interactive feedback
- Custom theme editor
- Mobile app version
- Keyboard shortcuts

## Acknowledgments

- [Anthropic](https://www.anthropic.com/) for Claude AI
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Shadcn UI](https://ui.shadcn.com/)
