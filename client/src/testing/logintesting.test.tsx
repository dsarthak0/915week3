import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '@/pages/LoginPage';
import * as handshakeService from '@/services/websocket/apis/prehandshake';
import * as loginService from '@/services/websocket/apis/login';
import * as otpService from '@/services/websocket/apis/otp';

// 1. Mock the service modules
jest.mock('@/services/websocket/apis/prehandshake');
jest.mock('@/services/websocket/apis/login');
jest.mock('@/services/websocket/apis/otp');

describe('LoginPage', () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Suppress window.alert for tests
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renders Step 1 (Credentials) initially', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    expect(screen.getByText(/Sign in to/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
  });

  it('transitions to Step 2 after successful initial authentication', async () => {
    // Setup mocks
    (handshakeService.preAuthHandshake as jest.Mock).mockResolvedValue({});
    (loginService.login as jest.Mock).mockResolvedValue({});

    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

    const continueBtn = screen.getByRole('button', { name: /CONTINUE/i });
    fireEvent.click(continueBtn);

    // Should show loading state
    expect(screen.getByText(/Authenticating/i)).toBeInTheDocument();

    // Wait for Step 2 to appear
    await waitFor(() => {
      expect(screen.getByText(/Verify your identity/i)).toBeInTheDocument();
    });
    
    expect(screen.getByPlaceholderText('0000')).toBeInTheDocument();
  });

  it('calls onLoginSuccess and sets localStorage when OTP is valid', async () => {
    // 1. Get to Step 2
    (handshakeService.preAuthHandshake as jest.Mock).mockResolvedValue({});
    (loginService.login as jest.Mock).mockResolvedValue({});
    (otpService.validateOtp as jest.Mock).mockResolvedValue({
      jwtTokens: { accessToken: 'fake-token-123' }
    });

    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    // Trigger Step 1
    fireEvent.click(screen.getByRole('button', { name: /CONTINUE/i }));
    
    // Wait for Step 2
    const otpInput = await screen.findByPlaceholderText('0000');
    
    // Enter OTP
    fireEvent.change(otpInput, { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /VERIFY & LOGIN/i }));

    await waitFor(() => {
      expect(localStorage.getItem('bearer_token')).toBe('fake-token-123');
      expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('shows alert on login failure', async () => {
    (handshakeService.preAuthHandshake as jest.Mock).mockRejectedValue(new Error('Failed'));
    
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    fireEvent.click(screen.getByRole('button', { name: /CONTINUE/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login sequence failed.");
    });
  });
});