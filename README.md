# PADM&BILL (OPC) PRIVATE LIMITED - Event Management Website

Professional event management website for PADM&BILL, featuring weddings, corporate events, concerts, parties, and festivals across Dehradun and Uttarakhand.

## Website Features
- ✅ Responsive design
- ✅ SEO optimized (meta tags, sitemap, robots.txt)
- ✅ YouTube video integration (Holi, Valentine's Day, New Year parties)
- ✅ Project portfolio showcase
- ✅ Ticket booking integration (BookMyShow & AllEvents)
- ✅ Contact form
- ✅ JSON-LD structured data for search engines

## Files Structure
```
/
├── index.html                    # Main website file with all sections
├── sitemap.xml                   # XML sitemap for search engines
├── robots.txt                    # Robots configuration
├── .gitignore                    # Git ignore file
└── VENUE- (...).png              # Event poster image
```

## Deployment Instructions

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create repository named `padmandbill-website`
3. Do NOT initialize with README

### Step 2: Push to GitHub
Run in PowerShell:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
cd "C:\Users\DELL\Documents\PADM&BILL (OPC) PRIVATE LIMITED"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/padmandbill-website.git
git push -u origin main
```
Replace `YOUR-USERNAME` with your GitHub username.

### Step 3: Deploy on Netlify
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Connect GitHub account
4. Select repository `padmandbill-website`
5. Leave build settings blank (static site)
6. Click "Deploy site"

### Step 4: Connect Custom Domain
1. In Netlify dashboard, go to Site Settings → Domain Management
2. Add custom domain
3. Copy the 4 nameservers provided by Netlify

### Step 5: Update Domain Nameservers
1. Log in to your domain registrar
2. Go to DNS/Nameserver settings
3. Replace current nameservers with the 4 nameservers from Netlify
4. Wait 24-48 hours for DNS propagation

### Step 6: Submit to Search Engines

#### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property (your domain)
3. Verify via DNS TXT record (Netlify auto-verifies after nameserver update)
4. Go to Indexing → Sitemaps
5. Submit: `/sitemap.xml`

#### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add site
3. Verify and submit sitemap

## Contact Information
- **Company**: PADM&BILL (OPC) PRIVATE LIMITED
- **Phone**: +91 6395279991 | +91 6395600361
- **Email**: padmbill1012@gmail.com
- **Address**: Sanskriti Lok Colony, Morowala, Brahmanwala, Dehradun, Uttarakhand – 248001

## SEO Features
- Optimized meta descriptions and keywords
- Open Graph tags for social sharing
- Twitter Card support
- JSON-LD structured data (Organization + LocalBusiness schema)
- XML sitemap with all pages
- Robots.txt for search engine crawling

---
**Website Status**: Ready for deployment
**Last Updated**: January 17, 2026
