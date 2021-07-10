import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Preview from './Preview';
import Editor from './Editor';

const Home = () => {
	const [links, setLinks] = useState([]);
	const url = 'https://retoolapi.dev/pjtRi1/links';

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

	const updateLinks = async (updatedLinks) => {
		setLinks([]);
		setLinks(updatedLinks);
	};

	if (links) {
		return (
			<div className="home home-flex">
				<Editor links={links} updateLinks={updateLinks} />
				<Preview links={links} updateLinks={updateLinks} />
			</div>
		);
	} else {
		return <h1>Loading...</h1>;
	}
};

export default Home;
