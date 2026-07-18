import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WormPlotGuide } from '@/components/WormPlotGuide'

describe('WormPlotGuide', () => {
  it('renders interactive SVG mode when no image provided', () => {
    render(<WormPlotGuide />)
    expect(screen.getByText(/Guía de interpretación interactiva/)).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders image mode when image path provided', () => {
    render(<WormPlotGuide image="/precomputed/04/worm-plot.png" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/precomputed/04/worm-plot.png')
  })

  it('lists all four pathologies in image mode', () => {
    render(<WormPlotGuide image="/precomputed/04/worm-plot.png" />)
    expect(screen.getByText(/Nivel/)).toBeInTheDocument()
    expect(screen.getByText(/Pendiente/)).toBeInTheDocument()
    expect(screen.getByText(/Forma de U/)).toBeInTheDocument()
    expect(screen.getByText(/Forma de S/)).toBeInTheDocument()
  })

  it('lists all four pathologies in interactive mode', () => {
    render(<WormPlotGuide />)
    expect(screen.getAllByText('Nivel (intercepto)').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Pendiente').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Forma de U').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Forma de S').length).toBeGreaterThanOrEqual(1)
  })

  it('shows pathology detail on button click', () => {
    render(<WormPlotGuide />)
    const buttons = screen.getAllByRole('button')
    const nivelButton = buttons.find((b) => b.textContent === 'Nivel (intercepto)')
    expect(nivelButton).toBeDefined()
    fireEvent.click(nivelButton!)
    expect(screen.getByText(/Revisar el predictor de μ/)).toBeInTheDocument()
  })

  it('shows default instruction when no pathology selected', () => {
    render(<WormPlotGuide />)
    expect(screen.getByText('Pasa el cursor sobre las regiones')).toBeInTheDocument()
  })
})
