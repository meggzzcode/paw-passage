# Tool usage tracking

The site sends a few anonymous usage events to Google Analytics 4 (only when a measurement ID is set in Business settings). They never contain anything a visitor types. They exist so the owner can see which tools are used and drop the ones that are not.

## Events
| Event | Meaning | tool_name values |
|---|---|---|
| `tool_start` | Visitor first touched a tool | `pet-cost-workflow`, `checklist` |
| `tool_complete` | Visitor got a result. `tool_label` says which (`total` or `message`) | `pet-cost-workflow` |
| `tool_copy` | Copied the summary or message | `pet-cost-workflow` |
| `tool_print` | Printed | `pet-cost-workflow`, `checklist` |
| `rules_search` | Used the dog-rules search or filters (`tool_label` is the filter name, never the typed text) | `dog-rules` |
| `rules_view` | Opened a place's rules page | `dog-rules` |
| `rules_source_click` | Clicked through to the official source | `dog-rules` |

Each event also carries `page_path`, `tool_label` and `item_count`.

## Reading them in Google Analytics
1. Admin > Data display > Custom definitions > create custom dimensions (scope: Event) for `tool_name` and `tool_label`. Events are recorded without this, but you cannot report on those fields until the dimensions exist.
2. Reports > Engagement > Events: see counts per event. Explore > Free form: rows = `tool_name`, values = event count, filter on each event.
3. Compare `tool_start` and `tool_complete` per tool, and tool starts against page views of the page the tool sits on.

## Suggested rule for keeping a tool (the owner's judgment, not a research finding)
Review after 60 days. If fewer than about 5% of the visitors to a tool's page start it, simplify it, move it into an article, or remove it.
