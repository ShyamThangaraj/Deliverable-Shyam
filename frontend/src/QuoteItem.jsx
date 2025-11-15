// src/QuoteItem.jsx
function QuoteItem({ name, message, time }) {
	return (
		<div className="quote-item">
			<p className="quote-message">“{message}”</p>
			<p className="quote-meta">
				— {name} • <span>{new Date(time).toLocaleString()}</span>
			</p>
		</div>
	);
}

export default QuoteItem;