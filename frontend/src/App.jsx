import "./App.css";
import { useEffect, useState } from "react";
import QuoteItem from "./QuoteItem";

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAge, setMaxAge] = useState("all");
	const [submitted, setSubmitted] = useState(false);

	const fetchQuotes = async (age = maxAge) => {
		try {
			const res = await fetch(`/api/quotes?max_age=${age}`);
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

	useEffect(() => {
		fetchQuotes();
	}, [maxAge]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const form = e.target;
		const formData = new FormData(form);

		try {
			const res = await fetch("/api/quote", {
				method: "POST",
				body: formData,
			});

			// backend returns 303 redirect; treat that as success too
			if (!res.ok && res.status !== 303) {
				console.error("Failed to submit quote:", res.status);
				return;
			}

			// clear form fields
			form.reset();

			// re-fetch quotes so we include the newly created one
			await fetchQuotes();

			setSubmitted(true);
			setTimeout(() => setSubmitted(false), 2000);
		} catch (err) {
			console.error("Error submitting quote:", err);
		}
	};

	return (
		<div className="App">
			<div className="logo-container">
				<img 
					src="/quotebook.png"
					alt="QuoteBook Logo"
					className="neon-logo"
				/>
			</div>

			<h1 className="title">Hack at UCI Tech Deliverable</h1>

			<div className="section">
				<h2>Submit a quote</h2>
				<form onSubmit={handleSubmit} className="quote-form">
					<div className="form-group">
						<label htmlFor="input-name">Name</label>
						<input 
							type="text" 
							name="name" 
							id="input-name" 
							required 
							className="form-input"
							placeholder="Enter your name"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="input-message">Quote</label>
						<input 
							type="text" 
							name="message" 
							id="input-message" 
							required 
							className="form-input"
							placeholder="Share your wisdom"
						/>
					</div>
					<button type="submit" className="submit-btn">
						{submitted ? "✓ Submitted" : "Submit"}
					</button>
				</form>
			</div>

			<div className="section">
				<h2>Previous Quotes</h2>
				<div className="filters">
					<label htmlFor="max-age">Show quotes from:</label>
					<select
						id="max-age"
						value={maxAge}
						onChange={(e) => setMaxAge(e.target.value)}
						className="filter-select"
					>
						<option value="week">Last week</option>
						<option value="month">Last month</option>
						<option value="year">Last year</option>
						<option value="all">All time</option>
					</select>
				</div>

				<div className="messages">
					{quotes.length === 0 ? (
						<p className="no-quotes">No quotes yet. Be the first!</p>
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
		</div>
	);
}

export default App;