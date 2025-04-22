import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Profile from '../../components/profile/Profile';

const mockStore = configureStore([]);

describe('Profile Component', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          bio: 'This is a test bio'
        }
      }
    });
  });

  test('renders profile form with user data', () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Test User');
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Bio')).toHaveValue('This is a test bio');
  });

  test('handles form input changes', () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
    
    const nameInput = screen.getByLabelText('Name');
    const bioInput = screen.getByLabelText('Bio');
    
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    fireEvent.change(bioInput, { target: { value: 'Updated bio information' } });
    
    expect(nameInput).toHaveValue('Updated Name');
    expect(bioInput).toHaveValue('Updated bio information');
  });

  test('handles form submission', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
    
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    
    const submitButton = screen.getByText('Update Profile');
    fireEvent.click(submitButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Profile updated:', expect.objectContaining({
      name: 'Updated Name',
      email: 'test@example.com',
      bio: 'This is a test bio'
    }));
    
    consoleSpy.mockRestore();
  });
}); 