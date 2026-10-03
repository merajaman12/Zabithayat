# Zabit Hayat Tele

GitHub Pages-ready single-page website inspired by the supplied reference design.

## Files
- `index.html` — website + admin modal
- `style.css` — responsive design
- `script.js` — posts, social links and admin functionality

## GitHub Pages
1. Create a GitHub repository.
2. Upload these three files.
3. Go to **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/root`.
5. Save and open the generated Pages URL.

## Admin
Open `#admin` on the website.
Default password: `zabit123`

The admin panel lets you:
- Manage the website name and description.
- Manage 8 post slots.
- Change each post title, description and link.
- Change Telegram, Pinterest, VK and Facebook Page usernames/links.
- Change the admin password.

### Important
This GitHub-only version stores changes in the browser's `localStorage`. That means the admin edits are persistent on the device/browser used for editing, but they are **not automatically published to every visitor**.

For a real multi-device admin system where you log in, edit a post once, and everyone sees the update, the next version should connect this UI to a backend such as Supabase/Firebase.
