function QuoteItem({ name, message, time }) {
	const formatTime = (timestamp) => {
		return new Date(timestamp).toLocaleString();
	};

	return (
		<div className="quote-item">
			<div className="quote-header">
				<span className="quote-name">{name}</span>
				<span className="quote-time">{formatTime(time)}</span>
			</div>
			<div className="quote-message-box">
				<p className="quote-message">"{message}"</p>
			</div>
		</div>
	);
}

export default QuoteItem;