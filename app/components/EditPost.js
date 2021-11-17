import React, { useEffect, useState, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./common/Page";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import DispatchContext from "./context/DispatchContext";
import StateContext from "./context/StateContext";

function ViewSinglePost() {
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);

    const originalState = {
        title: {
            value: "",
            hasErrors: false,
            message: ""
        },
        body: {
            value: "",
            hasErrors: false,
            message: ""
        },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        sendCount: 0
    }

    function ourReducer(draft, action) {
        switch (action.type) {
            case "fetchComplete":
                draft.title.value = action.value.title;
                draft.body.value = action.value.body;
                draft.isFetching = false;
                return
            case "titleChange":
                draft.title.value = action.value;
                return;
            case "bodyChange":
                draft.body.value = action.value;
                return;
            case "submitRequest":
                draft.sendCount++;
                return;
            case "saveRequestStarted":
                draft.isSaving = true;
                return;
            case "saveRequestFinished":
                draft.isSaving = false;
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, originalState)

    function submitHandler(e) {
        e.preventDefault();
        dispatch({ type: "submitRequest" })
    }

    useEffect(() => {
        const cancelRequest = Axios.CancelToken.source();

        (async function fetchData() {
            try {
                const response = await Axios.get(`/post/${state.id}`, { cancelToken: cancelRequest.token });
                dispatch({ type: "fetchComplete", value: response.data });
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        })();
        return () => {
            cancelRequest.cancel();
        }
    }, []);

    useEffect(() => {
        if (state.sendCount) {
            dispatch({ type: "saveRequestStarted" });
            const cancelRequest = Axios.CancelToken.source();

            (async function fetchData() {
                try {
                    const response = await Axios.post(
                        `/post/${state.id}/edit`,
                        { title: state.title.value, body: state.body.value, token: appState.user.token, },
                        { cancelToken: cancelRequest.token });
                    dispatch({ type: "saveRequestFinished" });
                    appDispatch({
                        type: "flashMessage",
                        value: "Congrats! You updated a post",
                    });
                    console.log(response.data);
                } catch (error) {
                    console.log(error);
                }
            })();
            return () => {
                cancelRequest.cancel();
            }
        }
    }, [state.sendCount]);

    if (state.isFetching) {
        return <Page title="...">
            <LoadingDotsIcon />
        </Page>
    }

    return (
        <Page title="Edit post">
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        autoFocus
                        name="title"
                        id="post-title"
                        className="form-control form-control-lg form-control-title"
                        type="text"
                        placeholder=""
                        autoComplete="off"
                        value={state.title.value}
                        onChange={(e) => { dispatch({ type: "titleChange", value: e.target.value }) }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"
                        type="text"
                        value={state.body.value}
                        onChange={(e) => { dispatch({ type: "bodyChange", value: e.target.value }) }}
                    ></textarea>
                </div>

                <button className="btn btn-primary" disabled={state.isSaving}>
                    {state.isSaving ? "Saving..." : "Save updates"}
                </button>
            </form>
        </Page>
    );
}

export default ViewSinglePost;
