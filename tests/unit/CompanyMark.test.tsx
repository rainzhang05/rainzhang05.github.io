import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompanyMark } from '@/components/site/CompanyMark';

describe('CompanyMark', () => {
  it('renders the mark at its own aspect ratio, with the org as alt text', () => {
    render(
      <CompanyMark mark={{ src: '/logos/feitian.svg', width: 88, height: 22 }} alt="FEITIAN" />
    );

    const mark = screen.getByAltText('FEITIAN');
    expect(mark).toHaveAttribute('src', '/logos/feitian.svg');
    expect(mark).toHaveAttribute('width', '88');
    expect(mark).toHaveAttribute('height', '22');
  });

  it('renders nothing for a role with no mark', () => {
    const { container } = render(<CompanyMark alt="Nowhere" />);

    expect(container).toBeEmptyDOMElement();
  });
});
