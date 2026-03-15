import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DownloadModal from './DownloadModal';
import { VIP_LIST } from '../constants';

// Mock Supabase
vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      getUser: vi.fn(() => ({ data: { user: null } })),
    },
  },
  recordDownload: vi.fn().mockResolvedValue({}),
  startTrial: vi.fn().mockResolvedValue({}),
}));

// Mock Purchases
vi.mock('@revenuecat/purchases-js', () => ({
  Purchases: {},
}));

describe('DownloadModal Flow', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    deferredPrompt: null,
    handleInstallApp: vi.fn(),
    variant: 'mobile' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start at account_setup step and show email/password fields', () => {
    render(<DownloadModal {...defaultProps} />);
    
    expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Min. 8 characters/i)).toBeInTheDocument();
  });

  it('should transition to payment step for non-VIP users', async () => {
    const { supabase } = await import('../services/supabase');
    (supabase.auth.signUp as any).mockResolvedValue({ data: { user: { id: 'test-user-id' } }, error: null });

    render(<DownloadModal {...defaultProps} />);
    
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Min. 8 characters/i), { target: { value: 'password123' } });
    
    const signupBtn = screen.getByText(/Sign Up & Continue/i);
    console.log('Button disabled state:', (signupBtn as HTMLButtonElement).disabled);
    
    fireEvent.click(signupBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Secure Payment/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should bypass payment and go to install step for VIP users', async () => {
    const { supabase } = await import('../services/supabase');
    (supabase.auth.signUp as any).mockResolvedValue({ data: { user: { id: 'vip-user-id' } }, error: null });

    const vipEmail = 'menard.devin.dm@gmail.com';
    
    render(<DownloadModal {...defaultProps} />);
    
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: vipEmail } });
    fireEvent.change(screen.getByPlaceholderText(/Min. 8 characters/i), { target: { value: 'password123' } });
    
    const signupBtn = screen.getByText(/Sign Up & Continue/i);
    fireEvent.click(signupBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Success!/i)).toBeInTheDocument();
      expect(screen.getByText(/Installation Guide/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
