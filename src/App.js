import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function App() {
	const [isHidden, setHidden] = useState(true);

	const hidePreview = () => {
		const previewElement = document.getElementById('preview');
		const previewBtn = document.getElementById('preview-btn');

		if (window.innerWidth <= 450 && isHidden) {
			previewElement.style.display = 'none';
			previewBtn.innerHTML = 'Preview';
		} else {
			previewElement.style.display = 'block';
			previewBtn.innerHTML = 'Close preview';
		}
	};

	window.onresize = resize;
	function resize() {
		if (window.innerWidth >= 450) {
			setHidden(false);
		} else {
			setHidden(true);
		}
	}

	useEffect(() => {
		hidePreview();
		// eslint-disable-next-line
	}, [isHidden]);

	return (
		<Router>
			<div className="App">
				<header className="App-header">
					<div className="headerContent">
						<h1>Beacons</h1>
					</div>
				</header>
				<button
					className="toggle-preview"
					id="preview-btn"
					onClick={() => {
						setHidden(!isHidden);
					}}
				>
					Preview
				</button>
				<div className="App-body">
					<Route exact path="/" component={Home} />
				</div>
			</div>
		</Router>
	);
}

export default App;
