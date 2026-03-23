/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 12 – NgRx ComponentStore
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   ComponentStore is a LOCAL, component-scoped alternative to the global
 *   NgRx store. It manages state for a single component or feature without
 *   actions or reducers — instead you use updaters (sync) and effects (async).
 *
 *   Testing strategy:
 *   - Provide the store as a service in TestBed (it owns its own state)
 *   - Test updaters by calling them and reading the resulting state via get()
 *   - Test selectors with firstValueFrom() — they are Observables
 *   - No MockStore needed — the real ComponentStore is used
 *
 * COMPONENT STORE APIS COVERED:
 *   - this.updater()    ← synchronous state mutation
 *   - this.select()     ← derived observable slice of state
 *   - this.get()        ← synchronous snapshot of current state
 *   - this.setState()   ← replace entire state (useful in tests)
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { TestBed }                    from '@angular/core/testing';
import { firstValueFrom }            from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { TodoStore }                  from './todo.store';

describe('TodoStore (ComponentStore)', () => {
  let store: TodoStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // ✅ Provide ComponentStore as a service — it manages its own state
      providers: [TodoStore],
    });
    store = TestBed.inject(TodoStore);
  });

  // ── Initial state ──────────────────────────────────────────────────────────
  it('should start with empty items and "all" filter', async () => {
    // ✅ firstValueFrom() reads the current emission of a selector Observable
    const items  = await firstValueFrom(store.items$);
    const filter = await firstValueFrom(store.filter$);
    expect(items).toHaveLength(0);
    expect(filter).toBe('all');
  });

  // ── addTodo updater ────────────────────────────────────────────────────────
  it('should add a new todo item', async () => {
    store.addTodo('Write tests');
    const items = await firstValueFrom(store.items$);
    expect(items).toHaveLength(1);
    expect(items[0].text).toBe('Write tests');
    expect(items[0].done).toBe(false);
  });

  // ── toggleTodo updater ─────────────────────────────────────────────────────
  it('should toggle a todo from undone to done', async () => {
    store.addTodo('Read docs');
    const items = await firstValueFrom(store.items$);
    const id    = items[0].id;

    store.toggleTodo(id);
    const updated = await firstValueFrom(store.items$);
    expect(updated[0].done).toBe(true);
  });

  it('should toggle a done todo back to undone', async () => {
    store.addTodo('Read docs');
    const items = await firstValueFrom(store.items$);
    const id    = items[0].id;

    store.toggleTodo(id);
    store.toggleTodo(id);
    const updated = await firstValueFrom(store.items$);
    expect(updated[0].done).toBe(false);
  });

  // ── removeTodo updater ─────────────────────────────────────────────────────
  it('should remove a todo by id', async () => {
    store.addTodo('Delete me');
    const items = await firstValueFrom(store.items$);
    const id    = items[0].id;

    store.removeTodo(id);
    const updated = await firstValueFrom(store.items$);
    expect(updated).toHaveLength(0);
  });

  // ── visibleItems$ selector (filter logic) ─────────────────────────────────
  it('should show only active items when filter is "active"', async () => {
    store.addTodo('Do this');
    store.addTodo('Done that');

    const items = await firstValueFrom(store.items$);
    store.toggleTodo(items[1].id); // mark second as done
    store.setFilter('active');

    const visible = await firstValueFrom(store.visibleItems$);
    // ✅ Only the undone item should appear
    expect(visible).toHaveLength(1);
    expect(visible[0].text).toBe('Do this');
  });

  it('should show only done items when filter is "done"', async () => {
    store.addTodo('Do this');
    store.addTodo('Done that');

    const items = await firstValueFrom(store.items$);
    store.toggleTodo(items[1].id);
    store.setFilter('done');

    const visible = await firstValueFrom(store.visibleItems$);
    expect(visible).toHaveLength(1);
    expect(visible[0].text).toBe('Done that');
  });
});
