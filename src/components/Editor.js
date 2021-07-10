import React, { useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';

const Editor = (props) => {
	const url = 'https://retoolapi.dev/pjtRi1/links';
	const { links, updateLinks } = props;
	const [showAddForm, setShowAddForm] = useState(false);

	const element = document.getElementById('add-btn');
	if (element) {
		if (showAddForm) {
			element.innerHTML = 'Close';
		} else {
			element.innerHTML = 'Add';
		}
	}

	const updateRecord = async (id, newTitle = '', newUrl = '') => {
		id = parseInt(id);

		const getLinkData = links.find((item) => item.id === id);
		const clicks = getLinkData.clicks;

		if (newTitle === '' && newUrl === getLinkData.url) {
			return;
		} else if (newUrl === '' && newTitle === getLinkData.title) {
			return;
		}

		let newRecord = {
			title: '',
			url: '',
			clicks: clicks,
		};

		if (newTitle === '') {
			newRecord = {
				title: getLinkData.title,
				url: newUrl,
				clicks: clicks,
			};
		} else {
			newRecord = {
				title: newTitle,
				url: getLinkData.url,
				clicks: clicks,
			};
		}

		try {
			var { data } = await axios.put(`${url}/${id}`, newRecord);
		} catch (e) {
			console.log(e);
		}

		const index = links.findIndex((item) => item.id === id);
		links[index] = data;

		updateLinks(links);
		showSnackbar('Link updated successfully!');
	};

	const onBlurTitle = (id, newTitle) => {
		updateRecord(id, newTitle);
	};

	const onBlurUrl = (id, newUrl) => {
		updateRecord(id, '', newUrl);
	};

	const deleteRecord = async (id) => {
		id = parseInt(id);

		try {
			await axios.delete(`${url}/${id}`);
		} catch (e) {
			console.log(e);
		}

		const index = links.findIndex((item) => item.id === id);
		links.splice(index, 1);

		updateLinks(links);
		showSnackbar('Link deleted successfully!');
	};

	const addRecord = async (newTitle, newUrl) => {
		setShowAddForm(false);

		const isAvailable = Boolean(links.find((item) => item.url === newUrl));

		if (isAvailable) {
			alert('This url already exists.');
			return;
		}

		let newRecord = {
			title: newTitle,
			url: newUrl,
			clicks: 0,
		};

		try {
			var { data } = await axios.post(url, newRecord);
		} catch (e) {
			console.log(e);
		}

		let newLinksArr = links;
		newLinksArr.push(data);

		updateLinks(newLinksArr);
		showSnackbar('Link added successfully!');
	};

	const showLinks = () => {
		if (links) {
			return (
				<div>
					{links.map((item) => (
						<div key={item.id} className="editor">
							{item.title && item.url ? (
								<Formik
									initialValues={{
										id: `${item.id}`,
										title: `${item.title}`,
										url: `${item.url}`,
									}}
									onSubmit={(values, actions) => {
										actions.setSubmitting(false);
									}}
								>
									{(props) => (
										// <div className="card">
										<form onSubmit={props.handleSubmit}>
											<div className="editor-form">
												<div className="form-left">
													<div className="input">
														<label htmlFor="name" className="input-label">
															Title
														</label>
														<input
															type="text"
															onChange={props.handleChange}
															onBlur={() =>
																onBlurTitle(props.values.id, props.values.title)
															}
															value={props.values.title}
															name="title"
															required
															autoComplete="off"
															className="input-field"
														/>
													</div>
													<div className="input">
														<label htmlFor="url" className="input-label">
															URL
														</label>
														<input
															type="text"
															onChange={props.handleChange}
															onBlur={() =>
																onBlurUrl(props.values.id, props.values.url)
															}
															value={props.values.url}
															name="url"
															required
															autoComplete="off"
															className="input-field"
														/>
													</div>
												</div>

												<div className="form-right">
													<div>
														<span className="input-label">Total clicks</span>
														<p className="info">{item.clicks}</p>
													</div>
													<button
														type="button"
														onClick={() => deleteRecord(props.values.id)}
														id="delete-btn"
													>
														Delete
													</button>
												</div>
											</div>
										</form>
										// </div>
									)}
								</Formik>
							) : (
								<></>
							)}
						</div>
					))}
				</div>
			);
		}
	};

	const addLinkForm = () => {
		if (showAddForm) {
			return (
				<Formik
					initialValues={{
						title: '',
						url: 'https://',
					}}
					onSubmit={(values, actions) => {
						actions.setSubmitting(false);
						addRecord(values.title, values.url);
					}}
				>
					{(props) => (
						<form onSubmit={props.handleSubmit} className="myForm">
							<div className="editor-form">
								<div className="form-left">
									<div className="input">
										<label for="title" className="input-label">
											Link title:
										</label>
										<input
											id="title"
											type="text"
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											value={props.values.title}
											name="title"
											required
											autoComplete="off"
											className="input-field"
										/>
										<label for="url" className="input-label">
											Link url:{' '}
										</label>
										<input
											id="url"
											type="text"
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											value={props.values.url}
											name="url"
											required
											autoComplete="off"
											className="input-field"
										/>
										<button type="submit" className="add-submit-btn">
											Add new link
										</button>
									</div>
								</div>
							</div>
						</form>
					)}
				</Formik>
			);
		}
	};

	const showSnackbar = (message) => {
		const element = document.getElementById('snackbar');

		element.innerHTML = message;
		element.className = 'show';

		// After 3 seconds, remove the show class from element
		setTimeout(function () {
			element.className = element.className.replace('show', '');
		}, 3000);
	};

	return (
		<div id="editor">
			<div className="editor-head">
				<h2 className="page-heading">Links</h2>
				<button
					onClick={() => setShowAddForm(!showAddForm)}
					className="add-btn"
					id="add-btn"
				>
					Add
				</button>
			</div>
			{addLinkForm()}
			{showLinks()}
			<div id="snackbar"></div>
		</div>
	);
};

export default Editor;
