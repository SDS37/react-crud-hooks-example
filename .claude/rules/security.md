# Security

Follow the [OWASP Top 10:2025](https://owasp.org/Top10/2025/). Apply a category where this app has that surface. Do not add accounts, cryptography, a database, or a monitoring stack so that a category looks covered. That addition needs its own accepted spec.

- **A01 Broken Access Control.** There are no user roles. The boundary that exists is the menu write: `POST` and `PUT` ignore the client's `iceCream.name` and store the catalogue name for `iceCream.id`. Do not let the client choose that name. Do not add a server request to a URL the client supplies.
- **A02 Security Misconfiguration.** Keep server rendering off, as `specs/upgrade.md` requires. Do not commit `.env` files or credentials. Do not enable a wildcard CORS origin, directory listing, or a debug mode that returns stack traces.
- **A03 Software Supply Chain Failures.** Add a dependency only when the accepted spec names it. The upgrade uses the versions in `specs/upgrade.md`. Do not install a package from a URL or git revision the spec does not name.
- **A04 Cryptographic Failures.** This app stores no passwords, tokens, or payment data. Do not add one without a spec. A secret from a later spec stays out of source, logs, and the client bundle.
- **A05 Injection.** Render menu text as React text. Do not use `dangerouslySetInnerHTML`, `innerHTML`, or `eval`. The server has no SQL. Do not build a query, a shell command, or an HTML string from a request field.
- **A06 Insecure Design.** A new trust boundary starts in `specs/`. The catalogue lookup stays on the server.
- **A07 Authentication Failures.** There is no login. Do not add a password, session, or token, and do not hardcode a credential, unless a spec defines that check.
- **A08 Software or Data Integrity Failures.** Do not weaken a characterization assertion. Do not deserialize a request with a mechanism that runs code.
- **A09 Security Logging and Alerting Failures.** Do not log request bodies or secrets. This demo has no alerting system. Do not add one without a spec.
- **A10 Mishandling of Exceptional Conditions.** A missing menu item stays a not-found response. Do not catch an error and continue as if the write succeeded. Do not send a stack trace to the client.
