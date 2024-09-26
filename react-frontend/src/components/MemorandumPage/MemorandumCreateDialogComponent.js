import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import initilization from "../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const MemorandumCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [memoid, setMemoid] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [memoid], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.memotitle)) {
                error["memotitle"] = `Memotitle field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.file)) {
                error["file"] = `File field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            memoid: _entity?.memoid?._id,memotitle: _entity?.memotitle,file: _entity?.file,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("memorandum").create(_data);
        const eagerResult = await client
            .service("memorandum")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "memoid",
                    service : "users",
                    select:["memoid"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Memorandum updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Memorandum" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setMemoid(res.data.map((e) => { return { name: e['memoid'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const memoidOptions = memoid.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Memorandum" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="memorandum-create-dialog-component">
            <div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="memoid">Memoid:</label>
                <Dropdown id="memoid" value={_entity?.memoid?._id} optionLabel="name" optionValue="value" options={memoidOptions} onChange={(e) => setValByKey("memoid", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["memoid"]) ? (
              <p className="m-0" key="error-memoid">
                {error["memoid"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="memotitle">Memotitle:</label>
                <InputText id="memotitle" className="w-full mb-3 p-inputtext-sm" value={_entity?.memotitle} onChange={(e) => setValByKey("memotitle", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["memotitle"]) ? (
              <p className="m-0" key="error-memotitle">
                {error["memotitle"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="file">File:</label>
                <InputText id="file" className="w-full mb-3 p-inputtext-sm" value={_entity?.file} onChange={(e) => setValByKey("file", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["file"]) ? (
              <p className="m-0" key="error-file">
                {error["file"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(MemorandumCreateDialogComponent);
