# Comic sharing — confirmed

All comics and artwork are private by default. Players can explicitly create an unguessable link for an individual finished comic, and revoke it at any time. Revocation prevents subsequent server-authorized access; it cannot erase copies already downloaded or cached by recipients.

Implemented foundation: private owner-only share-link metadata with hashed random tokens; token utilities and draft tests.

Still required before sharing is functional: authenticated link creation/revocation endpoints, a public token-validation endpoint, short-lived signed URLs or server-streamed pages, access checks on every request, rate limiting, no-index headers, and a sharing UI. Do not use permanent public image URLs or publish private storage buckets.
