import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompanyMark } from '@/components/site/CompanyMark';

describe('CompanyMark', () => {
  it('normalises a wordmark to the shared cap height, keeping its ratio', () => {
    render(
      <CompanyMark mark={{ src: '/logos/feitian.svg', width: 88, height: 22 }} alt="FEITIAN" />
    );

    const mark = screen.getByAltText('FEITIAN');
    expect(mark).toHaveAttribute('src', '/logos/feitian.svg');
    expect(mark).toHaveAttribute('height', '20');
    expect(mark).toHaveAttribute('width', '80');
  });

  it('gives a square mark the same height, so the two weigh alike', () => {
    render(
      <CompanyMark
        mark={{ src: '/logos/mnt-realty.svg', width: 28, height: 28 }}
        alt="MNT Realty"
      />
    );

    const mark = screen.getByAltText('MNT Realty');
    expect(mark).toHaveAttribute('height', '20');
    expect(mark).toHaveAttribute('width', '20');
  });

  it('renders nothing for a role with no mark', () => {
    const { container } = render(<CompanyMark alt="Nowhere" />);

    expect(container).toBeEmptyDOMElement();
  });
});
