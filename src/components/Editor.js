import React, { useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';

const Editor = (props) => {
	const url = 'https://retoolapi.dev/pjtRi1/links';
	const { links, updateLinks } = props; // get the props
	const [showAddForm, setShowAddForm] = useState(false);

	// manipulate the text on the button based on open or closed
	const element = document.getElementById('add-btn');
	if (element) {
		if (showAddForm) {
			element.innerHTML = 'Close';
		} else {
			element.innerHTML = 'Add';
		}
	}

	// this function add the new record to the backend as well as local array
	// it also passes the new links array to the parent component using props
	// this ensures that all components are up-to-date with the changes
	// this also ensures that no further api calls are to be made
	const addRecord = async (newTitle, newUrl) => {
		setShowAddForm(false);

		// check if the link already exists in the current list
		const isAvailable = Boolean(links.find((item) => item.url === newUrl));

		// if yes, show alert and stop the function
		if (isAvailable) {
			alert('This url already exists.');
			return;
		}

		// create a new record from the values entered
		let newRecord = {
			title: newTitle,
			url: newUrl,
			clicks: 0,
		};

		// post to the api
		try {
			var { data } = await axios.post(url, newRecord);
		} catch (e) {
			console.log(e);
		}

		// update the links array
		let newLinksArr = links;
		newLinksArr.push(data);

		// send it to the parent component
		updateLinks(newLinksArr);

		// show success snackbar
		showSnackbar('Link added successfully!');
	};

	// this function updates the records in the backend as well as local array
	// this updates title and link both
	const updateRecord = async (id, newTitle = '', newUrl = '') => {
		id = parseInt(id);

		// get the data from links array for that specific id
		const getLinkData = links.find((item) => item.id === id);
		const clicks = getLinkData.clicks; // store the total clicks

		// check if anything is changed or not
		// if nothing is changed, don't make the call to api to update nothing
		if (newTitle === '' && newUrl === getLinkData.url) {
			return;
		} else if (newUrl === '' && newTitle === getLinkData.title) {
			return;
		}

		// if changed, create a new record
		let newRecord = {
			title: '',
			url: '',
			clicks: clicks,
		};

		// check what is updated, title or url and modify the object accordingly
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

		// put the data to the backend
		try {
			var { data } = await axios.put(`${url}/${id}`, newRecord);
		} catch (e) {
			console.log(e);
		}

		// update the data in links array
		const index = links.findIndex((item) => item.id === id);
		links[index] = data;

		// send it to parent component
		updateLinks(links);

		// show success snackbar
		showSnackbar('Link updated successfully!');
	};

	// this function deletes the record from the backend as well as local array
	const deleteRecord = async (id) => {
		id = parseInt(id);

		// delete the record with specific id
		try {
			await axios.delete(`${url}/${id}`);
		} catch (e) {
			console.log(e);
		}

		// update the array
		const index = links.findIndex((item) => item.id === id);
		links.splice(index, 1);

		// send the updated array to the parent
		updateLinks(links);

		// show success snackbar
		showSnackbar('Link deleted successfully!');
	};

	// update the title when user clicks out of input area, if changed
	const onBlurTitle = (id, newTitle) => {
		updateRecord(id, newTitle);
	};

	// update the url when user clicks out of input area, if changed
	const onBlurUrl = (id, newUrl) => {
		updateRecord(id, '', newUrl);
	};

	// this functions builds the list to show all the link titles and urls
	// pre-filled with current values
	// also shows total clicks and delete button
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

	// function to display form and get data after clicking on "ADD"
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

	// function to show dynamic snackbars based on message passed
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
