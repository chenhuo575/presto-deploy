# Testing

## Happy Path (happyPath.cy.js)

The happy path test covers the core user journey:

1. Registers a new account successfully
2. Creates a new presentation with name and description
3. Updates the presentation title and thumbnail
4. Adds two new slides to the deck
5. Switches between slides using arrow controls
6. Deletes the presentation
7. Logs out successfully
8. Logs back in with the same credentials

## Alternative Path (alternativePath.cy.js)

### Steps

1. Registers a new account
2. Creates a new presentation
3. Adds a **text element** to the first slide
4. Adds a **code element** to the first slide
5. Adds a second slide and navigates to it
6. Adds a **video element** to the second slide
7. Clicks the **Preview** button to preview the presentation
8. Opens the **Slide Overview** panel and navigates via clicking a slide
9. Deletes a slide
10. Deletes the presentation and logs out

### Rationale

This path tests **different features** from the happy path, specifically focusing on **Feature Set 3 (adding elements to slides)** and **Feature Set 4 (preview and slide control panel)**. The happy path only covers authentication, presentation CRUD, slide creation/navigation, and logout — it does not interact with any slide elements or advanced features.
