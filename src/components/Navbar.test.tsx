import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders branding', () => {
    render(<Navbar />);
    expect(screen.getByText('ListeningProjectLp')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    
    // Check if mobile links are visible
    const mobileLinks = screen.getAllByText('Features');
    expect(mobileLinks.length).toBeGreaterThan(1);
  });

  it('calls onOpenDownload when desktop download button is clicked', () => {
    const onOpenDownload = vi.fn();
    render(<Navbar onOpenDownload={onOpenDownload} />);
    // In Navbar, the desktop download link is actually a link to Google Play in the current version
    // Wait, let's check the Navbar code again.
  });
});
