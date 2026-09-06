import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DisclosureRow, PanelBlock } from '@/components/site/DisclosureRow';

const labels = { expand: 'Show details', collapse: 'Hide details' };

function renderRow(overrides: Partial<Parameters<typeof DisclosureRow>[0]> = {}) {
  const onToggle = vi.fn();
  const props = {
    id: 'work-travel',
    meta: 'Jan 2025',
    title: 'Travel advisor',
    summary: 'A trip planner.',
    open: false,
    onToggle,
    labels,
    children: <p>Panel body</p>,
    ...overrides,
  };
  render(
    <ul>
      <DisclosureRow {...props} />
    </ul>
  );
  return { onToggle };
}

describe('DisclosureRow', () => {
  it('wires the button to its panel', () => {
    renderRow();

    const button = screen.getByRole('button', { name: 'Travel advisor' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'panel-work-travel');
    expect(document.getElementById('panel-work-travel')).toHaveAttribute(
      'aria-labelledby',
      'button-work-travel'
    );
  });

  it('gives the row an id the page can scroll to', () => {
    renderRow();

    expect(document.getElementById('row-work-travel')).toBeInTheDocument();
  });

  it('hides a closed panel from the tab order', () => {
    renderRow();

    expect(document.getElementById('panel-work-travel')?.className).toContain('invisible');
  });

  it('reveals the panel when open', () => {
    renderRow({ open: true });

    const button = screen.getByRole('button', { name: 'Travel advisor' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('panel-work-travel')?.className).toContain('visible');
  });

  it('keeps panel content in the DOM while closed, so opening is instant', () => {
    renderRow();

    expect(screen.getByText('Panel body')).toBeInTheDocument();
  });

  it('reports a toggle when the header is clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = renderRow();

    await user.click(screen.getByRole('button', { name: 'Travel advisor' }));
    expect(onToggle).toHaveBeenCalledWith('work-travel');
  });

  it('swaps its affordance label with its state', () => {
    const { rerender } = render(
      <ul>
        <DisclosureRow
          id="a"
          meta="2025"
          title="A"
          summary="s"
          open={false}
          onToggle={() => {}}
          labels={labels}
        >
          <p>body</p>
        </DisclosureRow>
      </ul>
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('title', 'Show details');

    rerender(
      <ul>
        <DisclosureRow id="a" meta="2025" title="A" summary="s" open onToggle={() => {}} labels={labels}>
          <p>body</p>
        </DisclosureRow>
      </ul>
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('title', 'Hide details');
  });

  it('renders the date column, subtitle and summary', () => {
    renderRow({ subtitle: 'MNT Realty · Vancouver, BC' });

    expect(screen.getByText('Jan 2025')).toBeInTheDocument();
    expect(screen.getByText('MNT Realty · Vancouver, BC')).toBeInTheDocument();
    expect(screen.getByText('A trip planner.')).toBeInTheDocument();
  });

  it('titles a sub-list row at the level it is given', () => {
    renderRow({ headingLevel: 'h4' });

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Travel advisor');
  });
});

describe('PanelBlock', () => {
  it('labels its content with an eyebrow', () => {
    render(
      <PanelBlock label="Stack">
        <p>Rust</p>
      </PanelBlock>
    );

    expect(screen.getByText('Stack')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();
  });
});
