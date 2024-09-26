import React from "react";
import { render, screen } from "@testing-library/react";

import DepartmentPage from "../DepartmentPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders department page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <DepartmentPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("department-datatable")).toBeInTheDocument();
    expect(screen.getByRole("department-add-button")).toBeInTheDocument();
});
