import { useId, useMemo, useState } from "react";
import { ChevronDown, Info, Plus, ShoppingBag, X } from "lucide-react";
import type { PackingConfig, PackingItem } from "@/lib/packing/schema";
import type { Trip } from "@/lib/packing/engine";
import { buyResponseFor } from "@/lib/packing/shopping";
import { MAX_NAME, MAX_QTY, type CustomItem, type Entry, type Group } from "@/lib/packing/state";
import { CATEGORY_ICONS, EXTRAS_ICON, FALLBACK_ICON } from "./icons";
import { ShoppingNote, ShoppingPanel } from "./Shopping";

export interface ItemActions {
  packed: (id: string, value: boolean, custom: boolean) => void;
  buy: (id: string, value: boolean, custom: boolean) => void;
  exclude: (id: string) => void;
  restore: (id: string) => void;
  addIdea: (id: string) => void;
  undo: () => void;
  quantity: (id: string, value: string | undefined, custom: boolean) => void;
  addCustom: (name: string, qty: string) => void;
  editCustom: (id: string, name: string, qty: string) => void;
  removeCustom: (id: string) => void;
}

function ItemRow({
  entry,
  trip,
  cfg,
  actions,
}: {
  entry: Entry;
  trip: Trip;
  cfg: PackingConfig;
  actions: ItemActions;
}) {
  const uid = useId();
  const [why, setWhy] = useState(false);
  const [editQty, setEditQty] = useState(false);
  const [qtyText, setQtyText] = useState("");
  const { item } = entry;
  const response = useMemo(
    () => (entry.buy ? buyResponseFor(item, trip, cfg) : undefined),
    [entry.buy, item, trip, cfg],
  );
  const whyId = `${uid}-why`;
  return (
    <li
      id={`item-${item.id}`}
      className="pk-item"
      data-item={item.id}
      data-packed={entry.packed}
      data-buy={entry.buy}
    >
      <div className="pk-item-main">
        <label className="pk-packed">
          <input
            type="checkbox"
            checked={entry.packed}
            onChange={(e) => actions.packed(item.id, e.target.checked, false)}
          />
          <span>
            <span className="pk-sr">Packed: </span>
            <span className="pk-name">{item.name}</span>
            {entry.isNew && <span className="pk-tag pk-tag-new">New</span>}
            {entry.inclusion === "added" && (
              <span className="pk-tag pk-tag-consider">Added by you</span>
            )}
            {entry.buy && <span className="pk-print-only"> (to buy)</span>}
          </span>
        </label>
      </div>
      <div className="pk-item-body">
        <p className="pk-what">{item.what}</p>
        {editQty ? (
          <form
            className="pk-qty-edit"
            onSubmit={(e) => {
              e.preventDefault();
              actions.quantity(item.id, qtyText, false);
              setEditQty(false);
            }}
          >
            <label className="pk-sr" htmlFor={`${uid}-q`}>
              Quantity for {item.name}
            </label>
            <input
              id={`${uid}-q`}
              className="pk-input"
              value={qtyText}
              maxLength={MAX_QTY}
              onChange={(e) => setQtyText(e.target.value)}
            />
            <button type="submit" className="pk-btn pk-btn-sm">
              Save
            </button>
            {entry.customQty && (
              <button
                type="button"
                className="pk-link-btn"
                onClick={() => {
                  actions.quantity(item.id, undefined, false);
                  setEditQty(false);
                }}
              >
                Use the suggestion
              </button>
            )}
            <button type="button" className="pk-link-btn" onClick={() => setEditQty(false)}>
              Cancel
            </button>
          </form>
        ) : (
          entry.qtyText && (
            <p className="pk-qty">
              {entry.customQty ? (
                <span>Your quantity:</span>
              ) : /^\d/.test(entry.qtyText) ? (
                <span>Suggested:</span>
              ) : null}
              <strong>{entry.qtyText}</strong>
              <button
                type="button"
                className="pk-link-btn no-print"
                aria-label={`Change quantity for ${item.name}`}
                onClick={() => {
                  setQtyText(entry.customQty ?? entry.suggested.text);
                  setEditQty(true);
                }}
              >
                Change
              </button>
            </p>
          )
        )}
      </div>
      <div className="pk-item-actions no-print">
        <label className="pk-buy">
          <input
            type="checkbox"
            aria-label={`Need to buy: ${item.name}`}
            checked={entry.buy}
            onChange={(e) => actions.buy(item.id, e.target.checked, false)}
          />
          <ShoppingBag aria-hidden="true" focusable="false" />
          <span aria-hidden="true">Need to buy</span>
        </label>
        <button
          type="button"
          className="pk-why-btn"
          aria-expanded={why}
          aria-controls={whyId}
          onClick={() => setWhy((v) => !v)}
        >
          <Info aria-hidden="true" focusable="false" />
          Why bring this?
        </button>
        <button
          type="button"
          className="pk-remove-btn"
          aria-label={`Remove from list: ${item.name}`}
          onClick={() => actions.exclude(item.id)}
        >
          <X aria-hidden="true" focusable="false" />
          Remove from list
        </button>
      </div>
      {entry.packed && entry.buy && (
        <p className="pk-both no-print" role="note">
          <span>Marked as packed and needing to be bought.</span>
          <button
            type="button"
            className="pk-link-btn"
            onClick={() => actions.buy(item.id, false, false)}
          >
            Clear "Need to buy"
          </button>
          <button
            type="button"
            className="pk-link-btn"
            onClick={() => actions.packed(item.id, false, false)}
          >
            Clear "Packed"
          </button>
        </p>
      )}
      <div
        id={whyId}
        className="pk-why no-print"
        role="region"
        aria-label={`Why bring ${item.name}`}
        hidden={!why}
      >
        <p>{item.why}</p>
        {item.tip && <p>{item.tip}</p>}
        {entry.suggested.detail && !entry.customQty && <p>{entry.suggested.detail}</p>}
      </div>
      {entry.buy && response && <ShoppingPanel entry={entry} response={response} />}
    </li>
  );
}

function CustomRow({ item, actions }: { item: CustomItem; actions: ItemActions }) {
  const uid = useId();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [qty, setQty] = useState(item.qty);
  return (
    <li
      id={`item-${item.id}`}
      className="pk-item"
      data-item={item.id}
      data-custom="true"
      data-packed={item.packed}
      data-buy={item.buy}
    >
      {editing ? (
        <form
          className="pk-custom-form"
          style={{ margin: "-0.85rem -1rem", border: 0 }}
          onSubmit={(e) => {
            e.preventDefault();
            actions.editCustom(item.id, name, qty);
            setEditing(false);
          }}
        >
          <div className="pk-row">
            <label className="pk-field" htmlFor={`${uid}-n`}>
              Item name
              <input
                id={`${uid}-n`}
                className="pk-input"
                value={name}
                maxLength={MAX_NAME}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="pk-field" htmlFor={`${uid}-q`}>
              Quantity (optional)
              <input
                id={`${uid}-q`}
                className="pk-input"
                value={qty}
                maxLength={MAX_QTY}
                onChange={(e) => setQty(e.target.value)}
              />
            </label>
            <span className="pk-actions-row">
              <button type="submit" className="pk-btn pk-btn-sm">
                Save
              </button>
              <button type="button" className="pk-link-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </span>
          </div>
        </form>
      ) : (
        <>
          <div className="pk-item-main">
            <label className="pk-packed">
              <input
                type="checkbox"
                checked={item.packed}
                onChange={(e) => actions.packed(item.id, e.target.checked, true)}
              />
              <span>
                <span className="pk-sr">Packed: </span>
                <span className="pk-name">{item.name}</span>
                {item.buy && <span className="pk-print-only"> (to buy)</span>}
              </span>
            </label>
          </div>
          {item.qty && (
            <div className="pk-item-body">
              <p className="pk-qty">
                <span>Quantity:</span> <strong>{item.qty}</strong>
              </p>
            </div>
          )}
          <div className="pk-item-actions no-print">
            <label className="pk-buy">
              <input
                type="checkbox"
                aria-label={`Need to buy: ${item.name}`}
                checked={item.buy}
                onChange={(e) => actions.buy(item.id, e.target.checked, true)}
              />
              <ShoppingBag aria-hidden="true" focusable="false" />
              <span aria-hidden="true">Need to buy</span>
            </label>
            <button
              type="button"
              className="pk-link-btn"
              aria-label={`Edit ${item.name}`}
              onClick={() => {
                setName(item.name);
                setQty(item.qty);
                setEditing(true);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="pk-link-btn"
              aria-label={`Remove ${item.name}`}
              onClick={() => actions.removeCustom(item.id)}
            >
              Remove
            </button>
          </div>
          {item.buy && <ShoppingNote itemId={item.id} />}
        </>
      )}
    </li>
  );
}

function AddCustomForm({ actions }: { actions: ItemActions }) {
  const uid = useId();
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  return (
    <form
      className="pk-custom-form no-print"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        actions.addCustom(name, qty);
        setName("");
        setQty("");
      }}
    >
      <div className="pk-row">
        <label className="pk-field" htmlFor={`${uid}-n`}>
          Add your own item
          <input
            id={`${uid}-n`}
            className="pk-input"
            value={name}
            maxLength={MAX_NAME}
            placeholder="For example, a favorite toy"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="pk-field" htmlFor={`${uid}-q`}>
          Quantity (optional)
          <input
            id={`${uid}-q`}
            className="pk-input"
            value={qty}
            maxLength={MAX_QTY}
            onChange={(e) => setQty(e.target.value)}
          />
        </label>
        <button type="submit" className="pk-btn pk-btn-sm" disabled={!name.trim()}>
          <Plus aria-hidden="true" focusable="false" />
          Add item
        </button>
      </div>
    </form>
  );
}

function Category({
  id,
  title,
  icon: Icon,
  total,
  packed,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: typeof FALLBACK_ICON;
  total: number;
  packed: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const listId = `pk-cat-${id}`;
  return (
    <section className="pk-cat" aria-labelledby={`${listId}-h`} data-category={id}>
      <h3 className="pk-cat-head" id={`${listId}-h`}>
        <button
          type="button"
          className="pk-cat-toggle"
          aria-expanded={open}
          aria-controls={listId}
          onClick={onToggle}
        >
          <Icon className="pk-cat-ico" aria-hidden="true" focusable="false" />
          <span className="pk-cat-title">{title}</span>
          <span className="pk-cat-count">
            {packed} of {total} packed
          </span>
          <ChevronDown className="pk-cat-chev" aria-hidden="true" focusable="false" />
        </button>
      </h3>
      <div id={listId} hidden={!open}>
        {children}
      </div>
    </section>
  );
}

export function Checklist({
  groups,
  custom,
  trip,
  cfg,
  actions,
  removed,
}: {
  groups: Group[];
  custom: CustomItem[];
  trip: Trip;
  cfg: PackingConfig;
  actions: ItemActions;
  removed: PackingItem[];
}) {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setClosed((c) => ({ ...c, [id]: !c[id] }));
  return (
    <section className="pk-checklist" aria-label="Your packing checklist">
      {groups.map((g) => (
        <Category
          key={g.category.id}
          id={g.category.id}
          title={g.category.label}
          icon={CATEGORY_ICONS[g.category.id] ?? FALLBACK_ICON}
          total={g.entries.length}
          packed={g.entries.filter((e) => e.packed).length}
          open={!closed[g.category.id]}
          onToggle={() => toggle(g.category.id)}
        >
          <ul className="pk-items">
            {g.entries.map((e) => (
              <ItemRow key={e.item.id} entry={e} trip={trip} cfg={cfg} actions={actions} />
            ))}
          </ul>
        </Category>
      ))}
      <Category
        id="extras"
        title="Items you've added"
        icon={EXTRAS_ICON}
        total={custom.length}
        packed={custom.filter((c) => c.packed).length}
        open={!closed["extras"]}
        onToggle={() => toggle("extras")}
      >
        {custom.length > 0 && (
          <ul className="pk-items">
            {custom.map((c) => (
              <CustomRow key={c.id} item={c} actions={actions} />
            ))}
          </ul>
        )}
        <AddCustomForm actions={actions} />
      </Category>
      {removed.length > 0 && (
        <details className="pk-more no-print" data-removed>
          <summary>
            Removed from your list ({removed.length})
            <ChevronDown aria-hidden="true" focusable="false" />
          </summary>
          <ul>
            {removed.map((i) => (
              <li key={i.id}>
                <span>{i.name}</span>
                <button
                  type="button"
                  className="pk-btn pk-btn-sm"
                  aria-label={`Add back to my list: ${i.name}`}
                  onClick={() => actions.restore(i.id)}
                >
                  Add back
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
