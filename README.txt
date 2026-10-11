SASAH AI WEBSITE — HOW TO HOST AND UPDATE
=========================================

1) Settings (one file only)
   Open assets/js/config.js to set the email, phone, WhatsApp number, city and Formspree ID.
   Every page reads them from there.
   - PHONE_DISPLAY and WHATSAPP are empty for now, so all "Call us" and WhatsApp buttons are hidden.
     When you have a dedicated number, fill them in and the buttons appear across the whole site.

2) Enquiry form (Formspree — recommended)
   formspree.io -> free account -> New Form -> your email -> copy the Form ID
   -> config.js: FORMSPREE_ID: "xxxxxxx". Enquiries then arrive in your inbox.
   If left empty, the form opens the visitor's email app with their details filled in.

3) Editing content
   Pages are generated from the Python files in ../sasah-ai-source.
   Edit those files, then run:   python sasah-ai-source/build.py
   (it writes into this sasah-ai-site folder). Plans are defined in sasah-ai-source/pricing.py.
   Prices are intentionally not shown on the site; every plan has a "Request a quote" button.

4) Domain
   The site assumes "https://sasah.ai" (canonical links, social previews, sitemap).
   If you use another domain, change DOMAIN in sasah-ai-source/common.py and rebuild.

5) Hosting — any one of:
   a) Netlify (free): drag and drop this folder at app.netlify.com/drop.
   b) Cloudflare Pages (free): Workers & Pages -> Create -> Pages -> Upload assets -> this folder.
   c) Hostinger / cPanel shared hosting: upload ALL files in this folder to public_html
      (including .htaccess — it is a hidden file, turn on "show hidden files").
   d) Your own VPS (nginx): copy the folder to /var/www/sasah, then in nginx:
        root /var/www/sasah;  index index.html;  error_page 404 /404.html;
        location / { try_files $uri $uri/ =404; }
      HTTPS: sudo certbot --nginx -d sasah.ai -d www.sasah.ai

6) Connecting the domain
   In your hosting panel choose "Add custom domain" and add the DNS records (A / CNAME) it shows
   at your domain registrar (GoDaddy / Namecheap / Hostinger). HTTPS is automatic.

7) After launch
   - Add the domain to Google Search Console and submit sitemap.xml.
   - Send a test enquiry and check that the email arrives.

Pages:  /  /custom-ai/  /workforce/  /homewatch/  /websites/  /plans/  /about/  /privacy/  /terms/  /404.html
        (/pricing/ redirects to /plans/)
Images: assets/img (screenshots use demo data; one face is blurred)
