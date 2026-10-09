# Comic reader and downloads — confirmed

Players can read complete comics on the website, download individual pages as image files, and download complete comic books as PDFs. Authorized share links should support reading and downloading too, unless the owner revokes the link.

Implemented in this commit:
- Mobile-responsive page-by-page reader component.
- Page sorting, validation schema and safe filename helper.

Not implemented yet:
- Authenticated comic data fetch and integration with private Supabase Storage.
- Public share-token validation and short-lived image delivery.
- Image download and server-generated PDF endpoints.
- Authorization and rate limiting for both owner and share-link access.
- Integration tests and actual PDF assembly.

Security: Never expose the Supabase service-role key or permanent public storage URLs. Share-link access must be checked before each download; revocation cannot invalidate files already downloaded or cached.
