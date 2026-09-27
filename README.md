# Folco Soffietti — portfolio

Complete static website with the supplied artwork, hand cursor, movable landscape, project pages, book readers, embedded aquaculture interface, photo turntable and a Three.js sculpture viewer.

## Publishing on GitHub Pages

The downloadable GitHub package contains a `docs` folder with the ready-to-publish website. No npm installation, API key or build service is required.

1. Create a GitHub repository and upload the package contents, preserving the folders.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/docs**, then **Save**.
5. Wait for GitHub to publish the site. GitHub shows its URL in the Pages settings.

The relative links work for both a repository site (`username.github.io/repository/`) and a root site. Keep the `.nojekyll` file inside the published folder. Do not upload this package inside an extra enclosing folder.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Editing

- `projects.json`: project titles, descriptions, image selections, captions and readers.
- `build.py`: page structure, section introductions and navigation.
- `docs/style.css`: typography, spacing, colour, responsive layouts and reveals.
- `docs/site.js`: hand cursor, draggable landscape/gallery, previews, readers and photographic turntable.
- `docs/sculpture.js`: interactive OBJ viewer and accessible controls.
- `docs/assets/`: artwork, fonts, video, model and self-hosted Three.js modules.

After editing project content or the page template, run `python3 build.py`. Python 3 is only needed to regenerate pages; the published website does not need Python. Run `python3 validate.py` to check local links and assets. For local viewing, run `python3 -m http.server 8000 --directory docs` and open `http://localhost:8000`. Opening HTML directly as a local file will not load the 3D model because browsers restrict module and model requests from file URLs.

In the Sites working checkout, the equivalent published directory is `dist` rather than `docs`.

## Sculpture and artwork notes

The clay sculpture turntable uses the 16 supplied studio photographs. Their backgrounds remain original: the requested background edit was blocked by the image service. The black surround in the viewer is a display background, not a retouched photograph. Frame spacing reflects the original photographic sequence.

The woman statue uses the supplied OBJ geometry. Its separate MTL/textures were not included, so the viewer uses a neutral clay material. Rotate by dragging or using buttons/arrows, zoom with the wheel, pinch or buttons, and reset the view at any time. If WebGL is unavailable, the photograph remains visible.

The posture sketch was rendered from the supplied PDF at 90° clockwise. The small sketch accents use cropping, blending and opacity within the website; the original drawings are preserved. The aquaculture project runs in an embedded frame from its original GitHub URL and needs an internet connection.

Keyboard navigation, native touch scrolling and reduced-motion preferences are supported. Automated checks cover routes, assets, HTML structure, JavaScript syntax and OBJ parsing. Browser visual and interaction testing remains outstanding.

## Rights

Artwork and text remain the property of their respective rights holders. Original project credits are preserved on the pages and in the artwork. Three.js and font licence notices are included under `docs/assets/`.
