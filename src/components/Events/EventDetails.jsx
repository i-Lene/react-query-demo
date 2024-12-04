import { Link, useNavigate, Outlet, useParams } from "react-router-dom";

import Header from "../Header.jsx";

import { fetchEvent, deleteEvent, queryClient } from "../../util/http.js";

import { useMutation, useQuery } from "@tanstack/react-query";

import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const { id } = useParams();
  let navigate = useNavigate();

  let { mutate } = useMutation({
    mutationFn: () => deleteEvent({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"], refetchType: "none" });

      navigate('/events');
    },
  });

  let { data, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent({ id: id }),
  });

  if (isLoading) {
    return <p>Is Loading...</p>;
  }

  if (isError) {
    return (
      <ErrorBlock title="Error Fetching Event" message="Try again latter" />
    );
  }

  function handleDelete() {
    if (window.confirm("Are you sure you want delete event ?")) {
      mutate();
    }
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={"http://localhost:3000/" + data.image} alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {data.date} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </article>
    </>
  );
}
