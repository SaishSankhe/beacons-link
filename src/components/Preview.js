import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { Formik } from 'formik';

const Preview = (props) => {
	const url = 'https://retoolapi.dev/pjtRi1/links';
	const { links, updateLinks } = props;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isColorInputOpen, setIsColorInputOpen] = useState(false);
	const [type, setType] = useState(''); // corner type - "square" / "round"

	// manipulate the text on the button based on open or closed
	const element = document.getElementById('custom-btn');
	if (element) {
		if (isModalOpen) {
			element.innerHTML = 'Close';
		} else {
			element.innerHTML = 'Customize';
		}
	}

	// function to open the links and update the click value in the backend
	// as well as in the local array
	const onLinkClick = async (id) => {
		const getLinkData = links.find((item) => item.id === id);
		const clicks = getLinkData.clicks;

		const updateClicks = {
			clicks: clicks + 1,
		};

		try {
			var { data } = await axios.patch(`${url}/${id}`, updateClicks);
		} catch (e) {
			console.log(e);
		}

		const index = links.findIndex((item) => item.id === id);
		links[index] = data;

		updateLinks(links);
	};

	const showLinks = () => {
		if (links) {
			return (
				<div className="phone-preview">
					<p className="preview-heading">My links</p>
					{links.map((item) => (
						<Fragment key={item.id}>
							{item.title && item.url ? (
								<a
									href={item.url}
									target="blank"
									onClick={() => onLinkClick(item.id)}
								>
									<button className="link-button">{item.title}</button>
								</a>
							) : (
								<></>
							)}
						</Fragment>
					))}
				</div>
			);
		}
	};

	const getElementsByClass = (className) => {
		const element = document.getElementsByClassName(className);

		return element;
	};

	// function to change text and button color based on hex value passed
	const changeColor = (value) => {
		if (value === '#') return;

		const element = getElementsByClass('link-button');

		for (let i = 0; i < element.length; i++) {
			if (type === 'button') {
				element[i].style.backgroundColor = value;
			} else {
				element[i].style.color = value;
			}
		}
	};

	// form to get the hex code
	const colorInput = () => {
		return (
			<Formik
				initialValues={{
					hex: '#',
				}}
				onSubmit={(values, actions) => {
					actions.setSubmitting(false);
					changeColor(values.hex);
					setIsColorInputOpen(false);
					setType('');
				}}
			>
				{(props) => (
					<form onSubmit={props.handleSubmit} className="color-form">
						<div className="input margin-bottom-15">
							<label for="hex" className="input-label">
								Hex code
							</label>
							<div className="flex-col">
								<input
									id="hex"
									type="text"
									onChange={props.handleChange}
									onBlur={props.handleBlur}
									value={props.values.hex}
									name="hex"
									autoComplete="off"
									className="input-field"
								/>
								<button type="submit" className="margin-left-10">
									Save
								</button>
							</div>
						</div>
					</form>
				)}
			</Formik>
		);
	};

	const showModal = () => {
		if (isModalOpen) {
			return (
				<div className="modal">
					<div className="modal-item">
						<p className="modal-label">Button corners</p>
						<div>
							<button
								onClick={() => {
									changeCorners('square');
								}}
								className="modal-btn"
								id="square"
							>
								Square
							</button>
							<button
								onClick={() => {
									changeCorners('round');
								}}
								className="modal-btn"
								id="round"
							>
								Rounded
							</button>
						</div>
					</div>

					<div className="modal-item">
						<p className="modal-label">Colors</p>
						<div>
							{isColorInputOpen ? colorInput() : <></>}
							<button
								onClick={() => {
									setIsColorInputOpen(!isColorInputOpen);
									setType('text');
								}}
								className="modal-btn"
							>
								Text
							</button>
							<button
								onClick={() => {
									setIsColorInputOpen(!isColorInputOpen);
									setType('button');
								}}
								className="modal-btn"
							>
								Button
							</button>
						</div>
					</div>
				</div>
			);
		}
	};

	// function to change corner types in preview mode
	const changeCorners = (type) => {
		const linkBtns = getElementsByClass('link-button');
		const roundEle = document.getElementById('round');
		const squareEle = document.getElementById('square');

		if (type === 'round') {
			for (let i = 0; i < linkBtns.length; i++) {
				linkBtns[i].style.borderRadius = '30px';
			}
			roundEle.classList.add('btn-selected');
			squareEle.classList.remove('btn-selected');
		} else if (type === 'square') {
			for (let i = 0; i < linkBtns.length; i++) {
				linkBtns[i].style.borderRadius = '0px';
			}
			roundEle.classList.remove('btn-selected');
			squareEle.classList.add('btn-selected');
		}
	};

	const customizeBtn = () => {
		return (
			<div>
				<button
					className="custom-btn"
					id="custom-btn"
					onClick={() => {
						setIsModalOpen(!isModalOpen);
					}}
				>
					Customize
				</button>
			</div>
		);
	};

	return (
		<div className="preview-mode" id="preview">
			{showModal()}
			{showLinks()}
			{customizeBtn()}
		</div>
	);
};

export default Preview;
