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

const SingleMemorandumPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [memoid, setMemoid] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("memorandum")
            .get(urlParams.singleMemorandumId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"memoid"] }})
            .then((res) => {
                set_entity(res || {});
                const memoid = Array.isArray(res.memoid)
            ? res.memoid.map((elem) => ({ _id: elem._id, memoid: elem.memoid }))
            : res.memoid
                ? [{ _id: res.memoid._id, memoid: res.memoid.memoid }]
                : [];
        setMemoid(memoid);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Memorandum", type: "error", message: error.message || "Failed get memorandum" });
            });
    }, [props,urlParams.singleMemorandumId]);


    const goBack = () => {
        navigate("/memorandum");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Memorandum</h3>
                </div>
                <p>memorandum/{urlParams.singleMemorandumId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Memotitle</label><p className="m-0 ml-3" >{_entity?.memotitle}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">File</label><p className="m-0 ml-3" >{_entity?.file}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">Memoid</label>
                    {memoid.map((elem) => (
                        <Link key={elem._id} to={`/users/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.memoid}</p>
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

export default connect(mapState, mapDispatch)(SingleMemorandumPage);
