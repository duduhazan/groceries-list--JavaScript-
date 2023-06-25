import "./style.css";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { ListForm } from "./listForm";
import { Api } from "../../api";
import { toast } from "react-toastify";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

export const Home = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [list, setList] = useState([]);
  const [openedImageUrl, setOpenedImageUrl] = useState("");

  const setupList = async () => {
    setPageLoading(true);
    try {
      const newList = await Api.getProducts();
      setList(newList);
    } catch (e) {
      console.log(e.message);
    }
    setPageLoading(false);
  };

  useEffect(() => {
    setupList();
  }, []);

  const setCategory = async (c) => {
    setPageLoading(true);
    const allItemsList = await Api.getProducts();
    const newList = allItemsList.filter((item) => {
      if (c == "all") return item;
      if (item.category == c) return item;
    });
    setList(newList);
    setPageLoading(false);
  };

  const onClose = (e) => {
    e && e.preventDefault();
    setIsEdit(false);
    setIsFormOpen(false);
  };
  const editItem = async (e, { item }) => {
    setIsEdit(true);
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const deleteProduct = async (e, { item }) => {
    try {
      await Api.deleteProduct(item._id);
      setupList();
      toast("Item deleted successfully!", { type: "success" });
    } catch (e) {
      toast("Item erase didn't succeed", { type: "error" });
    }
  };

  const openImage = async (e, { item }) => {
    const url = await Api.getProductImageUrl(item.imageName);
    setOpenedImageUrl(url);
  };
  return (
    <>
      <main
        className={!!openedImageUrl ? "main-blured" : "main"}
        onClick={() => setOpenedImageUrl("")}
      >
        <section className="section headline-section">
          <h1 className="head-text">Shopping Cart</h1>
          <h4>You can add, edit, delete new items</h4>
          <Button
            className="add-button"
            variant="primary"
            size="lg"
            onClick={() => setIsFormOpen(true)}
          >
            Add Item
          </Button>
          <DropdownButton
            as={ButtonGroup}
            key="Secondary"
            id="dropdown-variants-secondary"
            variant="secondary"
            size="lg"
            title="Select category"
            onSelect={(c) => setCategory(c)}
          >
            <Dropdown.Item eventKey="Fruits">Fruits</Dropdown.Item>
            <Dropdown.Item eventKey="Vegetables">Vegetables</Dropdown.Item>
            <Dropdown.Item eventKey="Meat">Meat</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="all">all Items</Dropdown.Item>
          </DropdownButton>
          <div
            className={`modal fade ${isFormOpen && "modal-visible show"}`}
            id="exampleModalCenter"
            tabIndex="100"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    {isEdit ? "Edit item" : "Add new item"}
                  </h5>
                </div>
                <div className="modal-body">
                  <ListForm
                    setupList={setupList}
                    onClose={onClose}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    item={selectedItem}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section shopping-list-section">
          {!list?.length && (
            <div className="no-items-div">
              There are no items on your groceries list
            </div>
          )}
          {!!list?.length && (
            <>
              <h3 className="head-text">Items List</h3>
              <ul className="shopping-list-ul">
                {list.map((item) => {
                  return (
                    <li className="shopping-list-li" key={item._id}>
                      <div className="shopping-list-li-div">
                        <span>{item.name}</span>
                        <span>{item.category}</span>
                        <span>{Number(item.price).toFixed(2)}$</span>
                        <span className="icons-span">
                          <i
                            className="bi bi-image"
                            onClick={(e) => openImage(e, { item })}
                          ></i>{" "}
                          <i
                            className="bi bi-pencil-square"
                            onClick={(e) => editItem(e, { item })}
                          ></i>{" "}
                          <i
                            className="bi bi-trash3"
                            onClick={(e) => deleteProduct(e, { item })}
                          ></i>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>
      </main>
      {!!openedImageUrl && (
        <img className="selected-image" src={openedImageUrl} />
      )}
    </>
  );
};
