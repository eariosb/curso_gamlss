import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ParamTabs } from '@/components/ParamTabs'

describe('ParamTabs', () => {
  it('renders only tabs for provided parameters', () => {
    render(
      <ParamTabs
        mu={{ formula: 'mu = b0 + b1*x', link: 'log' }}
        sigma={{ formula: 'sigma = g0', link: 'log' }}
      />
    )
    expect(screen.getByText('μ')).toBeInTheDocument()
    expect(screen.getByText('σ')).toBeInTheDocument()
    expect(screen.queryByText('ν')).not.toBeInTheDocument()
    expect(screen.queryByText('τ')).not.toBeInTheDocument()
  })

  it('shows mu content by default', () => {
    render(
      <ParamTabs
        mu={{ formula: 'mu = b0 + b1*x', link: 'log' }}
        sigma={{ formula: 'sigma = g0', link: 'log' }}
      />
    )
    expect(screen.getByText('mu = b0 + b1*x')).toBeInTheDocument()
    expect(screen.getByText('log').closest('code')).toBeInTheDocument()
  })

  it('switches to sigma tab on click', () => {
    render(
      <ParamTabs
        mu={{ formula: 'mu = b0', link: 'log' }}
        sigma={{ formula: 'sigma = g0 + g1*z', link: 'log' }}
      />
    )
    fireEvent.click(screen.getByText('σ'))
    expect(screen.getByText('sigma = g0 + g1*z')).toBeInTheDocument()
  })

  it('renders all four tabs when all params provided', () => {
    render(
      <ParamTabs
        mu={{ formula: 'mu formula', link: 'log' }}
        sigma={{ formula: 'sigma formula', link: 'log' }}
        nu={{ formula: 'nu formula', link: 'identity' }}
        tau={{ formula: 'tau formula', link: 'log' }}
      />
    )
    expect(screen.getByText('μ')).toBeInTheDocument()
    expect(screen.getByText('σ')).toBeInTheDocument()
    expect(screen.getByText('ν')).toBeInTheDocument()
    expect(screen.getByText('τ')).toBeInTheDocument()
  })

  it('has proper ARIA tablist roles', () => {
    render(
      <ParamTabs
        mu={{ formula: 'mu', link: 'log' }}
      />
    )
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })
})
