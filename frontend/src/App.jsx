import "./App.css";
import { useEffect, useState } from "react";
import QuoteItem from "./QuoteItem";

function App() {
	const [quotes, setQuotes] = useState([]);

	useEffect(() => {
		// Load all quotes on page load
		const fetchQuotes = async () => {
			try {
				// Use /api so the frontend dev server can proxy to the backend
				const res = await fetch("/api/quotes?max_age=all");
				if (!res.ok) {
					console.error("Failed to fetch quotes:", res.status);
					return;
				}
				const data = await res.json();
				setQuotes(data);
			} catch (err) {
				console.error("Error fetching quotes:", err);
			}
		};

		fetchQuotes();
	}, []);

	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form action="/api/quote" method="post">
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			<div className="messages">
				{quotes.length === 0 ? (
					<p>No quotes yet. Be the first!</p>
				) : (
					quotes.map((q, idx) => (
						<QuoteItem
							key={idx}
							name={q.name}
							message={q.message}
							time={q.time}
						/>
					))
				)}
			</div>
		</div>
	);
}

export default App;