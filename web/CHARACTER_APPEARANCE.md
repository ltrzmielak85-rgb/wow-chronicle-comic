# Character appearance — confirmed hybrid design

Each character gets a private appearance profile based on race, class, gender and available equipment metadata. Players may optionally supply a screenshot to refine the character's appearance. Stable features should carry across pages and quests.

Implemented:
- Character appearance SQL table with owner-only row-level security.
- Private reference-image storage bucket and user-path-scoped storage policies.
- Authenticated GET/PUT API for appearance metadata.
- Shared continuity prompt builder.

Not yet implemented:
- Screenshot upload and verification endpoint/UI.
- Actual extraction of race/class/equipment from all addon versions.
- Reference image processing and generation provider integration.
- Automated visual consistency tests.
- Versioned snapshot of appearance per generated comic page.

Do not store user-uploaded images in a public bucket. Never allow arbitrary client-provided storage paths to be attached to a character. Bind screenshots to the authenticated owner and character in a trusted endpoint.
