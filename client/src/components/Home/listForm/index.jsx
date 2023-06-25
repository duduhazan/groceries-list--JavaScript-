import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Api } from "../../../api";
import "./style.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

export const ListForm = (props) => {
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(false);
  const name = useRef();
  const price = useRef();
  const image = useRef();

  useEffect(() => {
    const { isEdit, item } = props;
    image.current.value = "";
    if (!isEdit) {
      name.current.value = "";
      price.current.value = "";
      setCategory();
      return;
    }
    name.current.value = item.name;
    price.current.value = item.price;
    setCategory(item.category);
  }, [props.isEdit]);

  const addOrEditItem = async (event) => {
    event.preventDefault();

    if (!name.current.value.length) {
      toast("Name not selected", { type: "error" });
      return;
    }

    if (!price.current.value.length) {
      toast("Price not selected", { type: "error" });
      return;
    }

    if (isNaN(price.current.value)) {
      toast("Price must be a number!", { type: "error" });
      return;
    }

    if (price.current.value < 0) {
      toast("Price must greater than 0", { type: "error" });
      return;
    }

    if (!category) {
      toast("Category not selected", { type: "error" });
      return;
    }

    if (!image.current.files.length) {
      toast("Image not selected", { type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name.current.value);
    formData.append("category", category);
    formData.append("price", price.current.value);
    formData.append("image", image.current.files[0]);

    setLoading(true);

    try {
      props.isEdit
        ? await Api.updateProduct(props.item._id, formData)
        : await Api.addProduct(formData);
      props.setupList();
      toast(`Item ${props.isEdit ? "edited" : "added"} successfully!`, {
        type: "success",
      });
      props.onClose();
    } catch (e) {
      console.error(e.message);
      toast(`Could not ${props.isEdit ? "edit" : "add"} item!`, {
        type: "error",
      });
    }
    props.setIsEdit(false);
    setLoading(false);
  };
  return (
    <div className="card-form-container">
      <form className="card-form">
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1" className="item-form-label">
            Name:{" "}
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="milk"
            ref={name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput3" className="item-form-label">
            Price:{" "}
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="21"
            ref={price}
          />
        </div>

        <div className="form-group list-form-div-parent">
          <DropdownButton
            as={ButtonGroup}
            key="Secondary"
            id="dropdown-variants-secondary"
            variant="secondary"
            title="Select category"
            onSelect={(c) => setCategory(c)}
          >
            <Dropdown.Item eventKey="Fruits">Fruits</Dropdown.Item>
            <Dropdown.Item eventKey="Vegetables">Vegetables</Dropdown.Item>
            <Dropdown.Item eventKey="Meat">Meat</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="mb-3 form-group">
          <label htmlFor="form-label" className="item-form-label">
            Image:{" "}
          </label>
          <input
            className="form-control form-control-file"
            type="file"
            ref={image}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={props.onClose}>
            Close
          </button>
          {!!loading && (
            <button
              className="btn btn-primary"
              type="submit"
              disabled
              onClick={addOrEditItem}
            >
              <span
                className="spinner-border spinner-border-sm spinner-form"
                role="status"
                aria-hidden="true"
              ></span>
              Submit
            </button>
          )}
          {!loading && (
            <button
              className="btn btn-primary"
              type="submit"
              onClick={addOrEditItem}
            >
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
