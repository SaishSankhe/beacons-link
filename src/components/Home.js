import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Preview from './Preview';
import Editor from './Editor';

const Home = () => {
	const [links, setLinks] = useState([]); // stores the data from the api
	const url = 'https://retoolapi.dev/pjtRi1/links'; // store the api url

	// fetch the data on page render and set it in useState
	useEffect(() => {
		async function fetchData() {
			try {
				const { data } = await axios.get(url);
				setLinks(data);
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, []);

	// update links array if any changes are made within the child components
	// this function is passed as a prop to the child components
	const updateLinks = async (updatedLinks) => {
		setLinks([]);
		setLinks(updatedLinks);
	};

	// if links has any data, render child components
	if (links) {
		return (
			<div className="home home-flex">
				<Editor links={links} updateLinks={updateLinks} />
				<Preview links={links} updateLinks={updateLinks} />
			</div>
		);
	} else {
		// else render basic loading state
		return <h2>Loading...</h2>;
	}
};

export default Home;
