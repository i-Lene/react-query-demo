import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";

import { useMutation } from "@tanstack/react-query";

import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      return navigate('/events')
    }
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isLoading && <p>Submitting...</p>}
        {!isLoading && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={error.info?.message || "Try again later"}
        />
      )}
    </Modal>
  );
}
