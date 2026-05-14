# A2P 10DLC Console — POC

A clickable prototype of an admin/CRM console for **A2P 10DLC Phone Number Provisioning** inside the AbsenceSoft OpsAdmin product surface.

Built as a UX exploration based on the SPIKE: _SPIKE: A2P 10DLC Phone Number Provisioning — API Investigation & MVP Plan_.

## What's inside

| Page | What it does |
| --- | --- |
| **Overview** | KPIs, migration progress, provisioning pipeline funnel, "needs attention" queue, recent activity feed, Twilio integration health |
| **Customers** | CRM-style list of all 285 customers with status chips, search, filters, bulk actions |
| **Customer detail** | 6-step provisioning stepper · Brand · Campaign · Phone Number · timeline · audit · raw Twilio JSON |
| **New provisioning wizard** | 4-step side sheet: Customer → Brand → Campaign → Number & review |
| **Bulk migration** | Live batch progress, batch history, queue of legacy customers, "Start batch" sheet with dry-run |
| **Phone numbers** | Pool of all provisioned numbers + search-and-purchase side sheet |
| **Campaign templates** | Reusable Campaign blueprints + global opt-in/opt-out keywords |
| **Activity log** | Full audit feed of system + operator events |
| **Settings** | Auto-provisioning toggle, number search strategy, Twilio creds, alert routing |

## Running it

Zero build step. Two options:

### Option A — Open the standalone file
Double-click `A2P 10DLC Console — standalone.html`. Works offline. Everything (CSS, JS, fonts, logo) is inlined.

### Option B — Run the source locally
Any static file server works. The simplest:

```bash
# from the repo root
python3 -m http.server 8080
# then open http://localhost:8080/A2P%2010DLC%20Console.html
```

Or with Node:

```bash
npx serve .
```

## Tech stack

- **React 18** via CDN (no bundler)
- **Babel Standalone** for inline JSX (no build step)
- **AbsenceSoft Design System** — `colors_and_type.css` + Poppins/Figtree fonts + Material Symbols Outlined

The whole thing is a set of small `.jsx` files loaded as `<script type="text/babel">`. Edit a file, refresh the browser.

## File map

```
A2P 10DLC Console.html        ← entry point — open this
A2P 10DLC Console — standalone.html  ← single-file build for sharing

data.jsx                      ← mock customers, batches, activity
components.jsx                ← Button, Card, Chip, Alert, SideSheet, Modal, etc.
shell.jsx                     ← AppShell (sidebar + topbar)
page-overview.jsx             ← Overview / dashboard
page-customers.jsx            ← Customer list (CRM)
page-customer-detail.jsx      ← Customer detail (tabs)
page-wizard.jsx               ← New provisioning wizard
page-migration.jsx            ← Bulk migration console
page-resources.jsx            ← Numbers pool, templates, activity log, settings

colors_and_type.css           ← AbsenceSoft design tokens
fonts/                        ← Poppins + Figtree TTFs
assets/                       ← Logo, favicon
```

## Status

🟡 **Prototype only.** No real Twilio API calls. All data is mocked in `data.jsx`. The data shapes and field names match the SPIKE's proposed `TextProfile` entity and Twilio Trust Hub responses so the prototype maps cleanly to the production implementation.

## Linked SPIKE

See `SPIKE A2P 10DLC Phone Number Prov.html` for the full investigation and MVP plan.
