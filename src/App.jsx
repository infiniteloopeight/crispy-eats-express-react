import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState("");
  const [cartLoaded, setCartLoaded] = useState(false);

  const total = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  const slides = [
    {
      src: "/images/2-piece-chicken-meal.png",
      alt: "2 piece chicken meal",
    },
    {
      src: "/images/chicken-sandwich-combo.png",
      alt: "Chicken sandwich combo",
    },
    {
      src: "/images/5-wings-basket.png",
      alt: "5 wings basket",
    },
    {
      src: "/images/family-bucket.png",
      alt: "Family bucket",
    },
    {
      src: "/images/loaded-fries.png",
      alt: "Loaded fries",
    },
    {
      src: "/images/chicken-tenders-meal.png",
      alt: "Chicken tenders meal",
    },
  ];

  const [menuItems, setMenuItems] = useState([]);

  useEffect(function () {
    fetch(`${API_URL}/api/menu`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setMenuItems(data);
      })
      .catch(function (error) {
        console.log("Error loading menu:", error);
      });
  }, []);

  useEffect(function () {
    fetch(`${API_URL}/api/cart`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setCart(data.items || []);
        setCartLoaded(true);
      })
      .catch(function (error) {
        console.log("Error loading cart:", error);
      });
  }, []);

  useEffect(function () {
    if (cartLoaded === false) {
      return;
    }
  
    fetch(`${API_URL}/api/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart,
        total: total,
      }),
    }).catch(function (error) {
      console.log("Error saving cart:", error);
    });
  }, [cart, total, cartLoaded]);

  function changePage(newPage) {
    setPage(newPage);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }

  function nextSlide() {
    if (currentSlide >= slides.length - 1) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide <= 0) {
      setCurrentSlide(slides.length - 1);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  }

  function showNotification(message) {
    setNotification(message);

    setTimeout(function () {
      setNotification("");
    }, 2500);
  }

  function addToCart(item) {
    let itemFound = false;

    const updatedCart = cart.map(function (cartItem) {
      if (cartItem.name === item.name) {
        itemFound = true;

        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
        };
      }

      return cartItem;
    });

    if (itemFound === true) {
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }

    showNotification(item.name + " added to cart!");
  }

  function removeOne(index) {
    const updatedCart = [...cart];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity = updatedCart[index].quantity - 1;
    } else {
      updatedCart.splice(index, 1);
    }

    setCart(updatedCart);
  }

  function removeAll(index) {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  function placeOrder() {
    if (cart.length === 0) {
      showNotification("Your cart is empty!");
      return;
    }
  
    fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart,
        total: total,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        fetch(`${API_URL}/api/cart`, {
          method: "DELETE",
        });
      
        showNotification("Order placed successfully!");
        setCart([]);
      })
      .catch(function (error) {
        console.log("Error placing order:", error);
        showNotification("There was a problem placing your order.");
      });
  }

  function submitContactForm(event) {
    event.preventDefault();
    alert("Thank you! Your message has been sent successfully.");
    event.target.reset();
  }

  return (
    <div>
      <header>
        <nav className="navigation-bar">
          <a
            href="#"
            className="logo"
            onClick={function (event) {
              event.preventDefault();
              changePage("home");
            }}
          >
            <img src="/images/logo.png" alt="Crispy Eats Express Logo" />
            <span>Crispy Eats Express</span>
          </a>

          <button
            className="menu-toggle"
            onClick={function () {
              setMenuOpen(!menuOpen);
            }}
          >
            ☰
          </button>

          <div className={menuOpen ? "nav-links show" : "nav-links"}>
            <a
              href="#"
              onClick={function (event) {
                event.preventDefault();
                changePage("home");
              }}
            >
              Home
            </a>

            <a
              href="#"
              onClick={function (event) {
                event.preventDefault();
                changePage("menu");
              }}
            >
              Menu
            </a>

            <a
              href="#"
              onClick={function (event) {
                event.preventDefault();
                changePage("about");
              }}
            >
              About
            </a>

            <a
              href="#"
              onClick={function (event) {
                event.preventDefault();
                changePage("contact");
              }}
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      {notification !== "" && (
        <div className="cart-notification">{notification}</div>
      )}

      {page === "home" && (
        <main>
          <section className="hero">
            <div className="hero-text">
              <h1>Crispy Eats Express</h1>
              <p>
                Welcome to Crispy Eats Express, where every bite is hot, crispy, and full of flavor.
                Our tasty chicken meals, and french fries made quick, fresh, and most importantly served with love.
              </p>

              <a
                href="#"
                className="button"
                onClick={function (event) {
                  event.preventDefault();
                  changePage("menu");
                }}
              >
                View Menu
              </a>
            </div>

            <div className="hero-image">
              <img src="/images/whole-meal.png" alt="Whole meal" />
            </div>
          </section>

          <section className="gallery-section">
            <h2>Food Gallery</h2>
            <p>Take a look at some of our most delicious meals we got.</p>

            <div className="slider">
              <button className="prev" onClick={prevSlide}>
                Previous
              </button>

              <div className="slides">
                {slides.map(function (slide, index) {
                  return (
                    <img
                      key={index}
                      src={slide.src}
                      alt={slide.alt}
                      style={{
                        display: index === currentSlide ? "block" : "none",
                      }}
                    />
                  );
                })}
              </div>

              <button className="next" onClick={nextSlide}>
                Next
              </button>
            </div>
          </section>
        </main>
      )}

      {page === "menu" && (
        <main>
          <section className="menu-section">
            <h1>Our Menu</h1>
            <p>Crispy goods, tasty combos, and family meals for everyone.</p>

            <div className="menu-layout">
              <div className="menu-grid">
                {menuItems.map(function (item, index) {
                  return (
                    <div className="menu-card" key={index}>
                      <img src={item.image} alt={item.alt} className="menu-card-image" />
                      <h2>{item.name}</h2>
                      <p>{item.description}</p>
                      <p className="price">${item.price.toFixed(2)}</p>

                      <button
                        className="add-to-cart-btn"
                        onClick={function () {
                          addToCart(item);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>

              <aside className="cart-box">
                <h2>Your Cart</h2>

                <div>
                  {cart.length === 0 ? (
                    <p className="empty-cart">Your cart is empty.</p>
                  ) : (
                    cart.map(function (item, index) {
                      return (
                        <div className="cart-item" key={index}>
                          <div className="cart-item-info">
                            <h3>{item.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                          </div>

                          <div className="cart-actions">
                            <button
                              className="remove-item-btn"
                              onClick={function () {
                                removeOne(index);
                              }}
                            >
                              Remove 1
                            </button>

                            <button
                              className="remove-all-btn"
                              onClick={function () {
                                removeAll(index);
                              }}
                            >
                              Remove All
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="cart-summary">
                  <p>Total: ${total.toFixed(2)}</p>
                  <button className="clear-cart-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <button className="clear-cart-btn" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              </aside>
            </div>
          </section>
        </main>
      )}

      {page === "about" && (
        <main>
          <section className="about-section">
            <h1>About Us</h1>

            <p>
              Crispy Eats Express started with one simple idea: serve fresh, crispy comfort food that people of any age can enjoy any day of the week.
              What began as a small local restaurant quickly became a favorite place for students, families, and anyone craving a hot meal.
            </p>

            <p>
              Our mission is to give every customer delicious food, fast service, and a friendly experience at low cost.
              From juicy chicken meals to golden fries and special combos, we work hard to make every order fresh and fulfilling.
            </p>

            <p>
              At Crispy Eats Express, we believe great food brings people together because it's a sign of love.
              That is why we always focus on quality ingredients, generous portions, and flavors that keep our customers coming back.
            </p>
          </section>
        </main>
      )}

      {page === "contact" && (
        <main>
          <section className="contact-section">
            <h1>Contact Us</h1>
            <p>We would love to hear from you. Visit us or send us a message below for any questions/concerns.</p>

            <div className="contact-container">
              <div className="contact-form">
                <form onSubmit={submitContactForm}>
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />

                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />

                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" required></textarea>

                  <button type="submit">Send Message</button>
                </form>
              </div>

              <div className="contact-map">
                <iframe
                  src="https://www.google.com/maps?q=Brooklyn%20New%20York&output=embed"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  title="Crispy Eats Express Map"
                ></iframe>
              </div>
            </div>
          </section>
        </main>
      )}

      <footer>
        <p>
          Please Follow us at:{" "}
          <a href="https://www.facebook.com" target="_blank">
            Facebook
          </a>{" "}
          |{" "}
          <a href="https://www.instagram.com" target="_blank">
            Instagram
          </a>{" "}
          |{" "}
          <a href="https://www.youtube.com" target="_blank">
            YouTube
          </a>{" "}
          |{" "}
          <a href="https://www.tiktok.com" target="_blank">
            TikTok
          </a>
        </p>

        <p>Business Hours: Monday Closed | Tuesday - Sunday: 10:00 AM - 11:00 PM</p>
      </footer>
    </div>
  );
}

export default App;