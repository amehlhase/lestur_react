import React, { useState } from "react";
import "./App.css";
import {
  InputGroup,
  Input,
  Button,
  FormGroup,
  Label,
  Spinner,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BookCard from "./BookCard.jsx";

function App() {
  // States:
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [count, setCount] = useState(0);

  // Handle Search:
  const handleSubmit = () => {
    setCount(count + 1);
    setLoading(true);
    axios
      .get(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
      .then((res) => {
        if (res.data.items.length > 0) {
          setCards(res.data.items);
          setLoading(false);
        }
      })
      .catch((err) => {
        setCards([]);
        setLoading(false);
      });
  };

  // Main Show Case:
  const mainHeader = () => {
    return (
      <div className="main-image d-flex justify-content-center align-items-center flex-column">
        {/* Overlay */}
        <div className="filter"></div>
        <h1
          className="display-2 text-center text-white mb-3"
          style={{ zIndex: 2 }}
        >
          Lestur
        </h1>
        <div style={{ width: "60%", zIndex: 2 }}>
          <InputGroup size="lg" className="mb-3">
            <Input
              placeholder="Book Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button color="secondary" onClick={handleSubmit}>
              <i className="fas fa-search"></i>
            </Button>
          </InputGroup>
        </div>
      </div>
    );
  };

  // Enter Key für Submit-Button
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleCards = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center mt-3">
          <Spinner style={{ width: "3rem", height: "3rem" }} />
        </div>
      );
    } else {
      if (cards.length >= 1) {
        const items = cards.map((item, i) => {
          let thumbnail = "";
          if (item.volumeInfo.imageLinks) {
            thumbnail = item.volumeInfo.imageLinks.thumbnail;
          }

          return (
            <div className="col-lg-4 mb-3" key={item.id}>
              <BookCard
                thumbnail={thumbnail}
                title={item.volumeInfo.title}
                pageCount={item.volumeInfo.pageCount}
                language={item.volumeInfo.language}
                authors={item.volumeInfo.authors}
                publisher={item.volumeInfo.publisher}
                description={item.volumeInfo.description}
                previewLink={item.volumeInfo.previewLink}
                infoLink={item.volumeInfo.infoLink}
              />
            </div>
          );
        });
        return (
          <div className="container my-5">
            <div className="row">{items}</div>
          </div>
        );
      }
      if (count > 0 && cards.length < 1) {
        return (
          <div className="d-flex justify-content-center mt-3">
            <p>Sorry, we couldn't find any matches</p>
          </div>
        );
      }
    }
  };

  return (
    <div className="w-100 h-100">
      {mainHeader()}
      {handleCards()}
      <ToastContainer />
    </div>
  );
}

export default App;
