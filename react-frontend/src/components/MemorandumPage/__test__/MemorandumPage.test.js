import React from "react";
import { render, screen } from "@testing-library/react";

import MemorandumPage from "../MemorandumPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders memorandum page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <MemorandumPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("memorandum-datatable")).toBeInTheDocument();
    expect(screen.getByRole("memorandum-add-button")).toBeInTheDocument();
});
