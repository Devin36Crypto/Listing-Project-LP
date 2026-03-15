import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders branding and copyright', () => {
    render(<Footer />);
    expect(screen.getByText('Listening Project')).toBeInTheDocument();
    expect(screen.getByText(/© \d{4} Listening Project/)).toBeInTheDocument();
  });

  it('calls modal handler when About Us is clicked', () => {
    const onOpenAbout = vi.fn();
    render(<Footer onOpenAbout={onOpenAbout} />);
    fireEvent.click(screen.getByText('About Us'));
    expect(onOpenAbout).toHaveBeenCalled();
  });

  it('calls modal handler when Privacy Policy is clicked', () => {
    const onOpenPrivacy = vi.fn();
    render(<Footer onOpenPrivacy={onOpenPrivacy} />);
    fireEvent.click(screen.getByText('Privacy Policy'));
    expect(onOpenPrivacy).toHaveBeenCalled();
  });

  it('renders system status with pulse animation', () => {
    render(<Footer />);
    expect(screen.getByText('System Status')).toBeInTheDocument();
  });
});
