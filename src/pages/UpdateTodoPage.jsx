import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { asyncDetailTodo, asyncUpdateTodo } from "../states/todos/action"; // Assuming asyncUpdateTodo exists
import Swal from "sweetalert2";

function UpdateTodoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detailTodo = null } = useSelector((states) => states);
  const dispatch = useDispatch();
  
  const [formState, setFormState] = useState({
    title: "",
    description: "", // Added description here
    is_finished: false,
  });

  // Fetch Todo details when the component is loaded
  useEffect(() => {
    if (id) {
      dispatch(asyncDetailTodo(id));
    }
  }, [id, dispatch]);

  // Set form fields when the detailTodo is loaded
  useEffect(() => {
    if (detailTodo) {
      setFormState({
        title: detailTodo.title,
        description: detailTodo.description || "", // Set description here
        is_finished: detailTodo.is_finished,
      });
    }
  }, [detailTodo]);

  // Handle input changes for form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit the updated todo
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(asyncUpdateTodo(id, formState)).then(() => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Todo berhasil diperbarui!",
        showConfirmButton: false,
        timer: 1200,
      });
      navigate(`/todos/${id}`);
    });
  };

  return (
    <section>
      <div className="container pt-3">
        <h2>Edit Todo</h2>
        {detailTodo ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Todo Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formState.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Todo Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="is_finished"
                name="is_finished"
                checked={formState.is_finished}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="is_finished">
                Mark as Finished
              </label>
            </div>

            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </section>
  );
}

export default UpdateTodoPage;
