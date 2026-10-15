# Supreme Inspection Services: website preview

Design preview of the new Supreme Inspection Services website, built by Conversion Advantage. This folder is ready to publish with GitHub Pages.

## What is in this folder

| File or folder | What it is |
| --- | --- |
| `index.html` | The website page |
| `assets/css/` | The styles: `base.css`, `leaflet.css` (the map), `styles.css` (the site) |
| `assets/js/main.js` | The site's animations, map, forms and interactions |
| `assets/images/` | Every photo and graphic used on the site |
| `assets/video/` | The background video behind the contact section (loads only when visitors scroll near it) |
| `.nojekyll` | A small empty file that tells GitHub Pages to show the files exactly as they are. It is hidden on a Mac; keep it. |

## Publish it on GitHub Pages (about 5 minutes, no coding)

1. Sign in at github.com (or create a free account).
2. Click **New repository**, give it a name such as `supreme-preview`, set it to **Public**, and click **Create repository**. (GitHub Pages is free for public repositories.)
3. On the new repository page, click **uploading an existing file**.
4. Open this folder on your computer, select **everything inside it** (not the folder itself) and drag it onto the upload area. On a Mac, press Cmd + Shift + . (full stop) in Finder to show the hidden `.nojekyll` file so it is included.
5. Click **Commit changes** and wait for the upload to finish.
6. Go to **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
7. After a minute or two the page shows your link, for example `https://your-username.github.io/supreme-preview/`. Open it on desktop and phone before sharing.

## Updating it later

Upload the new files over the old ones (same names) with **Add file > Upload files**, then **Commit changes**. The link stays the same.

## Good to know

- The page is marked `noindex`, so search engines will not list this preview. Remove that line from `index.html` when it becomes the real website.
- Because the repository is public, anyone with the link, or who finds the repository, can see the files.
- The contact form runs in preview mode: it shows a thank-you message but does not send anything until a form service is connected.
- Fonts, the map library and the map tiles load from the internet, so viewers need a connection.
