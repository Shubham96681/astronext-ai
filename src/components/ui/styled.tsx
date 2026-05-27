import styled from '@emotion/styled';

/** Primary CTA — CSS-in-JS (Emotion) + optional Tailwind via className */
export const StyledPrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.65rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.purple} 0%, ${({ theme }) => theme.colors.primary} 100%);
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.glow};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(85, 44, 131, 0.35);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(37, 21, 69, 0.08);
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 1.25rem;
`;

export const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  background: ${({ theme }) => theme.colors.navy};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.sm};
`;
