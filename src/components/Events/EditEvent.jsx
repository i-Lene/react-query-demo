import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch the event data
  const {
    data: eventData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id),
  });

  // Mutation to update the event
  const { mutate } = useMutation({
    mutationFn: (formData) => updateEvent({ id, ...formData }),
    onMutate: async (data) => {
      const newEv = data.event;
     await queryClient.cancelQueries({ queryKey: ["events", id] });
      queryClient.setQueryData(["events", id], newEv);
    },
    onSuccess: () => {
      navigate("../");
    },
  });

  // Form submission handler
  function handleSubmit(formData) {
    mutate({
      id: id,
      event: formData,
    });
  }

  // Close modal handler
  function handleClose() {
    navigate("../");
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load event data. Please try again later.</p>;
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={eventData} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button" disabled={mutate.isLoading}>
          {mutate.isLoading ? "Updating..." : "Update"}
        </button>
      </EventForm>
    </Modal>
  );
}
