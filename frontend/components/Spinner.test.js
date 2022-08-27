// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from './Spinner'
import React from 'react'
import { screen, render } from '@testing-library/react'

beforeEach(() => {
  render(<Spinner />)
})

test('sanity', () => {
  expect(true).not.toBe(false)
})

test('spinner activates when prop -on- is true', () => {
  const { rerender } = render(<Spinner />)
  rerender(<Spinner on={true} />)
  screen.getByText('Please wait...')
})
