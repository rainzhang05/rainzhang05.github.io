import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompanyMark } from '@/components/site/CompanyMark';

describe('CompanyMark', () => {
  it('normalises a wordmark to the shared cap height, keeping its ratio', () => {
    render(
      <CompanyMark mark={{ src: '/logos/feitian.svg', width: 336, height: 60 }} alt="FEITIAN" />
    );

    const mark = screen.getByAltText('FEITIAN');
    expect(mark).toHaveAttribute('src', '/logos/feitian.svg');
    expect(mark).toHaveAttribute('height', '18');
    expect(mark).toHaveAttribute('width', '101');
  });

  it('gives a square mark the same height, so the two weigh alike', () => {
    render(
      <CompanyMark
        mark={{ src: '/logos/mnt-realty.svg', width: 28, height: 28 }}
        alt="MNT Realty"
      />
    );

    const mark = screen.getByAltText('MNT Realty');
    expect(mark).toHaveAttribute('height', '18');
    expect(mark).toHaveAttribute('width', '18');
  });

  it('renders nothing for a role with no mark', () => {
    const { container } = render(<CompanyMark alt="Nowhere" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('applies an optical scale when a mark needs to sit larger', () => {
    render(
      <CompanyMark
        mark={{ src: '/logos/mnt-realty.svg', width: 28, height: 28, scale: 1.45 }}
        alt="MNT Realty"
      />
    );

    const mark = screen.getByAltText('MNT Realty');
    expect(mark).toHaveAttribute('height', '26');
    expect(mark).toHaveAttribute('width', '26');
  });
});
