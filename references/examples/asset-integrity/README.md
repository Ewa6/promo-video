# Generic example: asset-integrity hero scenes

Custom scenes for a promo of **Acme Integrity**, a fictional asset-integrity product for offshore
oil & gas. The product, its brand and all data shown are invented. Read them as the quality bar
for custom scenes; they are **not** wired into the template. Examples the user provides always
take priority over this one (see `references/custom-scenes.md`).

| File | Recipe | What makes it work |
|---|---|---|
| `scenes/OffshoreScene.tsx` | world opener | Flat silhouette of a fixed platform (jacket, decks, derrick, crane, flare) at dawn over the sea; flare flicker and beacon blink; slow push-in; one line of type. |
| `scenes/VesselScene.tsx` | subject close-up | Pressure vessel V-210 drawn in SVG; callouts land on "weld", "thickness", "inspection" with realistic findings (MPI, 11.8 mm vs 12.7 mm nominal); the asset's history as a timeline on "story". |
| `scenes/LifecycleScene.tsx` | mechanism | Plan → inspection → anomaly → repair ring lighting on each word, then sliding aside for "one central cloud database". |
| `scenes/FieldScene.tsx` | product screen (mobile) | The tablet inspection form with TML thickness readings, photos, Good/Fair/Poor condition, "Submit & sync" flowing to the same database. |
| `scenes/InboxScene.tsx` | product screen | An inbox layout: sidebar of role inboxes (Integrity Lead, Work Scheduler, Site Supervisor, Fabric Crew) switching on each spoken role, tasks with domain stage names and DEF-numbers. |
| `scenes/ControlScene.tsx` | product screens + proof | Three document panels (RBI matrix, anomaly risk ranking, inspection certificate) on each spoken name, then one workflow line, revision history, an audit trail writing itself, and a SIGNED OFF stamp. |
| `scenes/DashboardScene.tsx` | product screen + payoff | Condition dashboard with system-group filter, anomaly donut, stacked risk bars; cursor clicks a bar and a drill-down list of high-risk equipment opens on "click". |

## API mapping to the template

| Example | Template |
|---|---|
| `../theme` → `C.base`, `C.baseDeep`, `C.primary`, `C.accent`, `C.highlight`, `C.soft`, `C.teal`, `C.high/medium/low` | `../../brand` → `C.bg`, `C.bgDeep`, `C.primary`, `C.accent`, `C.highlight`, `C.soft`, `C.accent`, `C.bad/warn/good` |
| `Grid` / `DarkGrid` | `LightBackdrop` / `DarkBackdrop` (respect the caption band) |
| `Logo`, `Kinetic`, `AppWindow`, `Card`, `Pill`, `Cursor` | same names in `components/ui.tsx` (`Kinetic` uses `accent`/`accentColor` instead of `accentWords`/`accent`) |
| `useScene().word / beat / props / duration` | same, plus `cue(props.x)` |
| fixed 1920×1080 coordinates | `useLayout()` for portrait/square variants |
| hand-rolled callouts, stamp, matrix | `Callout`, `Stamp`, `RiskMatrix`, `AuditLog`, `DeviceFrame`, `WorldBackdrop` in `components/kit.tsx` |
