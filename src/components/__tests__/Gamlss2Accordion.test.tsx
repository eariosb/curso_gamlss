import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Gamlss2Accordion } from '@/components/Gamlss2Accordion'

describe('Gamlss2Accordion', () => {
  it('renders the toggle button', () => {
    render(
      <Gamlss2Accordion
        gamlssCode="gamlss(y ~ x, family = GA)"
        gamlss2Code="gamlss2(y ~ x, family = GA)"
      />
    )
    expect(screen.getByText(/Equivalencia/)).toBeInTheDocument()
  })

  it('does not show code content when collapsed', () => {
    render(
      <Gamlss2Accordion
        gamlssCode="gamlss(y ~ x)"
        gamlss2Code="gamlss2(y ~ x)"
      />
    )
    expect(screen.queryByText('gamlss(y ~ x)')).not.toBeInTheDocument()
  })

  it('expands on click and shows both code blocks', () => {
    render(
      <Gamlss2Accordion
        gamlssCode="gamlss(y ~ x)"
        gamlss2Code="gamlss2(y ~ x)"
      />
    )
    fireEvent.click(screen.getByText(/Equivalencia/))
    expect(screen.getByText('gamlss(y ~ x)')).toBeInTheDocument()
    expect(screen.getByText('gamlss2(y ~ x)')).toBeInTheDocument()
  })

  it('shows note when provided', () => {
    render(
      <Gamlss2Accordion
        gamlssCode="old"
        gamlss2Code="new"
        note="This is a test note"
      />
    )
    fireEvent.click(screen.getByText(/Equivalencia/))
    expect(screen.getByText('This is a test note')).toBeInTheDocument()
  })

  it('has aria-expanded reflecting state', () => {
    render(
      <Gamlss2Accordion
        gamlssCode="old"
        gamlss2Code="new"
      />
    )
    const button = screen.getByText(/Equivalencia/)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })
})
