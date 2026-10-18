import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

// The default entry wraps the app in StrictMode. Its second effect run finds
// the containers' isMounted refs already false, so they never leave loading.
// Ticket 09 fixes those effects; StrictMode can return then.
startTransition(() => {
  hydrateRoot(document, <HydratedRouter />);
});
