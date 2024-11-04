import Head from "next/head";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState("");
  const [foodItem, setFoodItem] = useState("");
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [foodItems, setFoodItems] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    console.log(foodItems)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: foodItems }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function addFoodItem() {
    if (foodItem.trim() !== "") {
      const newItem = {
        item: foodItem,
        expiration: expirationDate,
      };
      setFoodItems([...foodItems, newItem]);
      setFoodItem("");
      setExpirationDate(new Date());
    }
  }

  // Function to format a date as "MM/DD/YYYY"
  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }

  // Sort the foodItems array by expiration date
  const sortedFoodItems = [...foodItems].sort((a, b) => a.expiration - b.expiration);

  return (
    <div>
      <Head>
        <title>Fridge Eats</title>
        <link rel="icon" href="/fridgeeats-logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/fridgeeats-logo.png" className={styles.icon} />
        <h3></h3>
        <form onSubmit={onSubmit}> 
          <input type="submit" value="Recommend me a dish!" />
        </form>
        <div className={styles.result}>{result}</div>
        

        <input
          type="text"
          placeholder="Add food to the fridge"
          value={foodItem}
          onChange={(e) => setFoodItem(e.target.value)}
        />

        <DatePicker
          selected={expirationDate}
          onChange={(date) => setExpirationDate(date)}
        />

        <button className= {styles.fridgeButton} onClick={addFoodItem}>Add to fridge</button>

        <ul>
          {sortedFoodItems.map((item, index) => (
            <li key={index}>
              {item.item} (Expires on: {formatDate(item.expiration)})
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
