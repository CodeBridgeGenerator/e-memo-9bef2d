import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";

import UsersPage from "../UsersPage/UsersPage";

const SingleDepartmentPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [deptid, setDeptid] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("department")
            .get(urlParams.singleDepartmentId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"deptid"] }})
            .then((res) => {
                set_entity(res || {});
                const deptid = Array.isArray(res.deptid)
            ? res.deptid.map((elem) => ({ _id: elem._id, nodept: elem.nodept }))
            : res.deptid
                ? [{ _id: res.deptid._id, nodept: res.deptid.nodept }]
                : [];
        setDeptid(deptid);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Department", type: "error", message: error.message || "Failed get department" });
            });
    }, [props,urlParams.singleDepartmentId]);


    const goBack = () => {
        navigate("/department");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Department</h3>
                </div>
                <p>department/{urlParams.singleDepartmentId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Deptname</label><p className="m-0 ml-3" >{_entity?.deptname}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">Deptid</label>
                    {deptid.map((elem) => (
                        <Link key={elem._id} to={`/users/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.nodept}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
        <UsersPage/>
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleDepartmentPage);
