import { createSlice } from '@reduxjs/toolkit';

// Check if user prefers dark mode
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Check if there's a stored theme preference
const storedTheme = localStorage.getItem('theme');

// Set initial theme based on stored preference or system preference
const initialTheme = storedTheme ? storedTheme : userPrefersDark ? 'dark' : 'light';

// Apply theme to document
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const initialState = {
  theme: initialTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
