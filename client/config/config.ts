export const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:30813'
    : 'http://localhost:8080';

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('Using baseURL:', baseURL);
