import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextAreaField, TextField } from '@/components/ui/Field';

const noop = () => {};

describe('TextField', () => {
  it('associates the label with its input', () => {
    render(<TextField label="Name" name="name" value="" onChange={noop} onBlur={noop} />);

    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('name', 'name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('announces an error and marks the input invalid', () => {
    render(
      <TextField label="Email" name="email" type="email" value="" error="Required" onChange={noop} onBlur={noop} />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Required');
  });

  it('leaves a valid input unmarked', () => {
    render(<TextField label="Email" name="email" value="a@b.co" onChange={noop} onBlur={noop} />);

    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-describedby');
  });

  it('reports typing and blurring', async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const user = userEvent.setup();
    render(<TextField label="Name" name="name" value="" onChange={onChange} onBlur={onBlur} />);

    await user.type(screen.getByLabelText('Name'), 'R');
    await user.tab();

    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });
});

describe('TextAreaField', () => {
  it('sizes itself to its text rather than being dragged', () => {
    render(<TextAreaField label="Message" name="message" value="" onChange={noop} />);

    const field = screen.getByLabelText('Message');
    expect(field).toHaveClass('resize-none');
    expect(field.style.overflowY).toBe('hidden');
    expect(field).toHaveAttribute('rows', '5');
  });

  it('renders a labelled textarea', () => {
    render(<TextAreaField label="Message" name="message" value="hi" onChange={noop} onBlur={noop} />);

    const area = screen.getByLabelText('Message');
    expect(area.tagName).toBe('TEXTAREA');
    expect(area).toHaveValue('hi');
  });

  it('surfaces its own error', () => {
    render(
      <TextAreaField label="Message" name="message" value="" error="Required" onChange={noop} onBlur={noop} />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByLabelText('Message')).toHaveAccessibleDescription('Required');
  });

  it('removes the error association when corrected', () => {
    const { rerender } = render(
      <TextAreaField label="Message" name="message" value="" error="Required" onChange={noop} />
    );
    const textarea = screen.getByLabelText('Message');
    expect(textarea).toHaveAccessibleDescription('Required');

    rerender(<TextAreaField label="Message" name="message" value="Hello" onChange={noop} />);
    expect(textarea).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
