# DRIP — Resources Module Datasets

**Owner:** Basil (MCP Resources)
**Location:** `src/modules/resources/`
**Purpose:** Static seed data backing every MCP Resource exposed by this module. Consumed by `resources.ts` (not yet built — pending Pizzaz reference for exact DI pattern) and, downstream, by the Planner and Operations modules via Tasks/Tools only — never by direct import.

---

## Files

| File | Records | Description |
|---|---|---|
| `zones.json` | 6 | Disaster zones — the anchor entity every other file links to via `zoneId` |
| `shelters.json` | 8 | Relief camps / shelters, capacity & occupancy, supplies |
| `hospitals.json` | 8 | Hospitals — beds, ICU, ventilators, disaster capabilities |
| `inventory.json` | 7 | Emergency warehouses — supply stock, storage capacity |
| `vehicles.json` | 8 | Ambulances, rescue boats, 4x4 trucks, water tanker, supply truck |
| `volunteers.json` | 8 | Individual volunteer profiles, tied to real response organizations |
| `emergency_contacts.json` | 16 | Real, dialable emergency numbers (national + Kerala state) |
| `incidents.json` | 4 | Active disaster events — extends `zones.json` with per-event detail (casualties, responding agencies, timeline) |

---

## Schema Conventions (apply to every file)

- **camelCase** for all keys — no `snake_case` anywhere.
- **Lowercase / kebab-case string enums** for status-like fields (`status`, `severity`, `priorityLevel`, `hazardType`, `shelterType`, etc.) — keeps `z.enum([...])` definitions clean in `resources.ts`.
- **`location`** is always `{ "lat": number, "lng": number }` — never `latitude`/`longitude`.
- **`zoneId`** is the join key across files (see below) — not `district`. Use `district` for display only.
- **`id`** is a stable, unique string per record (`H001`, `SH001`, `WH001`, `VH001`, `VOL001`, `EC001`, `zone-001`) — safe to use directly as an MCP resource URI segment, e.g. `drip://hospitals/H001`.
- Facility-type files (`shelters`, `hospitals`, `inventory`) carry `verified`, `verificationDate`, and `dataSource` fields for provenance.

---

## `zoneId` — the cross-file join key

Every dataset links back to `zones.json`. A record with `"zoneId": "zone-001"` belongs to the **Wayanad Landslide Corridor** zone. This lets any Task/Tool answer questions like *"list all shelters and hospitals in zone-004"* by filtering on this one field, without needing district-name matching.

Current zone coverage (some zones are intentionally lighter — they're lower-severity per `zones.json`):

| Zone | District | Shelters | Hospitals | Warehouses | Vehicles | Volunteers |
|---|---|---|---|---|---|---|
| `zone-001` | Wayanad | 3 | 3 | 3 | 5 | 5 |
| `zone-002` | Ernakulam | 1 | 1 | 1 | 1 | 1 |
| `zone-003` | Idukki (reservoir) | 1 | 1 | 1 | 0 | 0 |
| `zone-004` | Alappuzha (Kuttanad) | 1 | 1 | 1 | 2 | 2 |
| `zone-005` | Idukki (Munnar) | 1 | 1 | 0 | 0 | 0 |
| `zone-006` | Kozhikode | 1 | 1 | 1 | 0 | 0 |

`incidents.json` records also have their own `id` (`INC001`–`INC004`), which can serve as a secondary join key if another module (e.g. Operations) later tracks per-incident requests, dispatches, or rescue missions against a specific event rather than a whole zone.

`emergency_contacts.json` mostly uses `"zoneId": null` on purpose — most numbers (112, 108, 101, 100, KSEB 1912, KWA 1916, KSDMA 1070) are statewide/national and apply regardless of zone. Only district-specific control rooms (e.g. `EC007`, Wayanad DDMC) carry a `zoneId`.

---

## Data Provenance — what's real vs. simulated

This is important for anyone consuming this data downstream (Planner, Gemini report generation) so nobody presents simulated numbers as live facts.

**Grounded in real, current events/institutions:**
- `zones.json` and `incidents.json` — the Wayanad landslide (`zone-001` / `INC001`) and Idukki dam release (`zone-003` / `INC002`) reference actual reported July 2026 events (IMD/KSDMA alerts). `incidents.json` gives per-event detail (casualties, responding agencies, timeline) that `zones.json` summarizes at the zone level.
- All named hospitals are real government facilities (verified via web search), with real addresses and, where available, real published contact numbers.
- `volunteers.json` — `organization` values are real response bodies (NDRF 4th Battalion, Aapda Mitra, Kerala Civil Defence, SDRF). **Individual volunteer names/phones are simulated** — no real private individuals are represented.
- `emergency_contacts.json` — every number is a real, currently published helpline (112, 108, 101, 100, KSEB 1912, KWA 1916, KSDMA 1070/1077, etc.).

**Simulated (explicitly flagged in each record's `notes` field):**
- All operational numbers — bed occupancy, supply stock counts, fuel levels, vehicle status — are simulated for demo purposes. They are *not* wired to any live feed.

**Do not** treat this dataset as a live source of truth in any real emergency context. It's a structured, realistic seed dataset for building and demoing the MCP server.

---

## Known Gaps (not yet resolved)

- `zone-003`, `zone-005`, `zone-006` have no vehicles/volunteers assigned yet.
- `zone-005` (Munnar) has no warehouse.
- Data is a static snapshot as of **2026-07-18** — no live update mechanism exists in this module (by design — Resources are static; live updates belong to whichever module handles the "TODO Replace with X MCP Tool" integration pattern).

---

## Next Steps (for this module)

- [ ] `module.ts` — register module with `@Module`
- [ ] `service.ts` — load/query these JSON datasets (e.g. `getByZoneId()`, `getById()`)
- [ ] `resources.ts` — expose each file as an MCP Resource with Zod schema validation, following the Pizzaz reference pattern exactly
