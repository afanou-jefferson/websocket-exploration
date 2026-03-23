/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 17 – MatTable + MatSort + MatPaginator
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   MatTableDataSource handles filtering, sorting, and pagination internally.
 *   In tests, you verify the rendered rows and the DataSource state — you
 *   don't test Material internals, only your component's wiring.
 *
 *   CRITICAL: Call fixture.detectChanges() TWICE after ngAfterViewInit so
 *   that @ViewChild references (sort, paginator) are populated before the
 *   DataSource connects to them.
 *
 * PATTERNS COVERED:
 *   - Querying table rows via [data-testid="table-row"]
 *   - Setting dataSource.filter to test filter behaviour
 *   - Verifying dataSource.sort and paginator are connected
 *   - provideNoopAnimations() — required for table sort header animations
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations }     from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';

import { UserTableComponent, User } from './user-table.component';

const USERS: User[] = [
  { id: 1, name: 'Alice',   email: 'alice@test.com',   role: 'admin'  },
  { id: 2, name: 'Bob',     email: 'bob@test.com',     role: 'viewer' },
  { id: 3, name: 'Charlie', email: 'charlie@test.com', role: 'viewer' },
  { id: 4, name: 'Diana',   email: 'diana@test.com',   role: 'admin'  },
  { id: 5, name: 'Eve',     email: 'eve@test.com',     role: 'viewer' },
  { id: 6, name: 'Frank',   email: 'frank@test.com',   role: 'admin'  },
];

describe('UserTableComponent', () => {
  let fixture:   ComponentFixture<UserTableComponent>;
  let component: UserTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:   [UserTableComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture   = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;

    // Set input before first detectChanges
    component.users = USERS;

    // ✅ TWO detectChanges calls: first triggers ngOnInit + ngAfterViewInit,
    // second lets Angular wire up sort/paginator to the DataSource
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should render the first page of rows (pageSize = 5)', () => {
    const rows = fixture.nativeElement.querySelectorAll('[data-testid="table-row"]');
    // ✅ First page shows max 5 rows even though there are 6 users
    expect(rows.length).toBe(5);
  });

  it('should render the correct name in the first row', () => {
    const firstCell = fixture.nativeElement.querySelector('[data-testid="name-1"]');
    expect(firstCell.textContent).toContain('Alice');
  });

  it('should have the dataSource connected to sort', () => {
    // ✅ Verify wiring — if sort is null the table won't sort
    expect(component.dataSource.sort).toBeTruthy();
  });

  it('should have the dataSource connected to paginator', () => {
    expect(component.dataSource.paginator).toBeTruthy();
  });

  it('should filter rows when dataSource.filter is set', () => {
    // ✅ MatTableDataSource.filter applies client-side filtering
    component.dataSource.filter = 'admin';
    fixture.detectChanges();

    // admin users: Alice, Diana, Frank = 3
    expect(component.dataSource.filteredData.length).toBe(3);
  });

  it('should report the total count via dataSource.data', () => {
    expect(component.dataSource.data.length).toBe(6);
  });
});
