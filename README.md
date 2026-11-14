# Ashish DJ Music website

Responsive business website for Ashish DJ Music, Rewa, Madhya Pradesh.

## Pages and files
- `index.html` — home
- `services.html` — services
- `about.html` — about the brand
- `booking.html` — WhatsApp booking form
- `assets/css/styles.css` — responsive styling and animations
- `assets/js/config.js` — WhatsApp number and social links
- `assets/js/main.js` — navigation and booking interactions
- `api/bookings.js` — Vercel serverless endpoint for Supabase bookings
- `supabase-setup.sql` — database table setup

## 1. Set the WhatsApp number
Edit `assets/js/config.js` and replace `91XXXXXXXXXX` with your WhatsApp Business number, including India's country code 91. Use digits only, with no + sign, spaces or hyphens.

## 2. Set up Supabase (optional database)
1. Create a Supabase project at https://supabase.com/.
2. Open SQL Editor and run the contents of `supabase-setup.sql`.
3. Copy your project URL and the server-side service-role key from Project Settings → API.

## 3. Deploy with Vercel
1. Sign in at https://vercel.com/ and choose Add New → Project.
2. Import the GitHub repository `subhamtiwari871-sudo/Ashish-DJ-Music`.
3. Choose Framework Preset: Other. Leave Build Command empty and set Output Directory to `.` if Vercel asks.
4. Deploy. Vercel hosts the static pages and the `api/bookings.js` serverless function.
5. In Vercel → Project → Settings → Environment Variables, add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service-role key
6. Redeploy after adding the environment variables.
7. Test one booking, then check Supabase → Table Editor → `bookings`.

Never put the service-role key in browser JavaScript, HTML, or GitHub. Keep it only in Vercel environment variables.

## 4. Free static hosting alternative
GitHub Pages can serve the HTML/CSS/JS pages, but it cannot run `api/bookings.js`. For WhatsApp-only static hosting, open repository Settings → Pages → Deploy from a branch → main → /(root) → Save. For database storage, deploy this same repository to Vercel instead.

## Booking behaviour
The form opens WhatsApp with a prefilled message. The visitor must press Send in WhatsApp. The database insert is a separate action and only works after the Vercel and Supabase configuration above is complete.

## Add the supplied DJ photos to the homepage
Upload these six image files into the repository folder `assets/images/` using the exact filenames below. The homepage already references these paths:
- `ashish-logo-feel.webp` — first white ASHISH / FEEL THE MUSIC logo
- `ashish-dj-logo.webp` — second DJ ASHISH AI logo
- `ashish-event-poster.webp` — portrait Ashish Music event poster
- `ashish-home-stage.webp` — wide blue stage / DJ controller photo (homepage hero)
- `ashish-booking-promo.webp` — red booking promo artwork
- `ashish-dj-action.webp` — vertical DJ controller / sunset artwork

On GitHub mobile: open the repository → Code → open `assets` → open `images` → Add file → Upload files → choose the six images, rename each file to the exact filename above before uploading if necessary → Commit changes to `main`. GitHub Pages will rebuild automatically. Until these six image files are uploaded, their homepage image slots will show broken-image placeholders.

Business location and WhatsApp number are configured in `assets/js/config.js`: Indore, Madhya Pradesh, India and 917440209478.
