# Stitches Invoice Generator

A modern, AI-powered invoice generator built with Next.js, Supabase, and TailwindCSS. Create professional invoices with ease using either traditional forms or AI chat input.

## ✨ Features

- **AI-Powered Invoice Generation**: Create invoices using natural language chat
- **Traditional Form Input**: Classic form-based invoice creation
- **User Authentication**: Secure sign-up/sign-in with Supabase
- **PDF Generation**: Download invoices as professional PDFs
- **Payment Integration**: Stripe integration for premium features
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Real-time Database**: Supabase backend with real-time updates

## 🚀 Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: TailwindCSS with custom glass morphism effects
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **PDF Generation**: jsPDF
- **Payment Processing**: Stripe
- **AI Integration**: OpenAI API
- **Deployment**: Vercel

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (optional)
- Stripe account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/stitches-invoice-generator.git
   cd stitches-invoice-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # OpenAI API (optional)
   OPENAI_API_KEY=your_openai_api_key
   
   # Stripe (optional)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Database Setup**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the SQL schema from `supabase-schema.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
stitches-invoice-generator/
├── components/          # Reusable React components
│   ├── AuthContext.tsx  # Authentication context
│   ├── Header.tsx       # Navigation header
│   └── Navigation.tsx   # Main navigation
├── lib/                 # Utility libraries
│   └── supabase.ts      # Supabase client configuration
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   ├── auth.tsx        # Authentication page
│   ├── dashboard.tsx   # User dashboard
│   ├── index.tsx       # Main invoice form
│   └── ...             # Other pages
├── styles/             # Global styles
│   └── globals.css     # TailwindCSS and custom styles
├── supabase-schema.sql # Database schema
└── ...                 # Configuration files
```

## 🎨 Features Overview

### Authentication
- Email/password sign-up and sign-in
- Social authentication (Google, Apple)
- Password reset functionality
- Two-factor authentication support

### Invoice Generation
- **Traditional Form**: Fill out invoice details manually
- **AI Chat**: Describe your invoice in natural language
- **PDF Export**: Download professional PDF invoices
- **Template System**: Customizable invoice templates

### User Management
- User profiles and settings
- Invoice history and management
- Client management
- Subscription and billing

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

### Other Platforms

- **Netlify**: Similar process, supports Next.js
- **Railway**: Simple deployment with database
- **AWS/GCP**: For enterprise deployments

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql`
3. Configure authentication settings:
   - Site URL: `https://your-domain.com`
   - Redirect URLs: Add your domain + `/auth/callback`

### Stripe Setup

1. Create a Stripe account
2. Get your API keys from the dashboard
3. Add webhook endpoints for payment processing

### OpenAI Setup

1. Get an API key from OpenAI
2. Add to environment variables
3. Configure usage limits

## 📱 Usage

1. **Sign Up**: Create an account or sign in
2. **Create Invoice**: Use the form or AI chat
3. **Generate PDF**: Download your invoice
4. **Manage**: View history, edit templates, manage clients

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check this README
- **Issues**: Open a GitHub issue
- **Email**: Contact support

## 🎯 Roadmap

- [ ] Advanced template editor
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API for third-party integrations

---

Built with ❤️ using Next.js and Supabase