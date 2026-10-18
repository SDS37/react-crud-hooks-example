// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import useUniqueIds from "./useUniqueIds";

afterEach(cleanup);

const Field = ({ label }) => {
  const [inputId, errorId] = useUniqueIds(2);
  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} aria-describedby={errorId} />
      <span id={errorId}>{label} error</span>
    </div>
  );
};

it("links each label, input and error by id", () => {
  render(
    <>
      <Field label="Name" />
      <Field label="Price" />
    </>,
  );
  const name = screen.getByLabelText("Name");
  const price = screen.getByLabelText("Price");
  expect(name.id).not.toBe(price.id);
  expect(name).toHaveAccessibleDescription("Name error");
  expect(price).toHaveAccessibleDescription("Price error");
});

it("keeps the same ids across re-renders", () => {
  const { rerender } = render(<Field label="Name" />);
  const before = screen.getByLabelText("Name").id;
  rerender(<Field label="Name" />);
  expect(screen.getByLabelText("Name").id).toBe(before);
});
