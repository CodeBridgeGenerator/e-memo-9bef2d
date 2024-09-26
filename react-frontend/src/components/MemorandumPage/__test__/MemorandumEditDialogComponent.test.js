import React from "react";
import { render, screen } from "@testing-library/react";

import MemorandumEditDialogComponent from "../MemorandumEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders memorandum edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <MemorandumEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("memorandum-edit-dialog-component")).toBeInTheDocument();
});
