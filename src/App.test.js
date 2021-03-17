// import { render, screen } from '@testing-library/react';
// import App from './App';

//basic test to test circleci integration
import { addTwoNumbers } from "./TestTest";
test("Adds 3 + 2 to equal 5", () => {
  expect(addTwoNumbers(3, 2)).toBe(5);
});
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
