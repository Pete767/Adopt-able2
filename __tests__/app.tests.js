import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogin } from './auth/auth';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('./auth/auth', () => ({
  checkLogin: jest.fn(),
}));
jest.mock('./lib/api', () => ({
  getUserFavorites: jest.fn(),
}));

describe('App', () => {
  test('renders home page by default', () => {
    render(<App />);

    expect(screen.getByText('Welcome to PetFinder')).toBeInTheDocument();
  });

  test('renders login modal when showLogin is true', () => {
    useSelector.mockReturnValue(true);
    
    render(<App />);

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('dispatches checkLogin on mount', () => {
    render(<App />);
    
    expect(checkLogin).toHaveBeenCalled();
  });
});
