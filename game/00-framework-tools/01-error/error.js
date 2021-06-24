/**
 * Error reporter utility that provides enriched error messages to the user as a simple sugarcube plugin app
 */
Errors.config = {
	// TODO: link this to an environment variable
	// for the time being, it can be enabled on console via `Errors.config.debug = true`
	debug: false,
	maxLogs: 100,
	showReporterSelector: '.error-reporter-btn'
}
Errors.log = []
Errors.registerMessage = (message, copyData) => {
	while (Errors.log.length >= Errors.config.maxLogs) Errors.log.shift();
	let error = {message, copyData};
	Errors.log.push(error);
	return error;
}
Errors.report = (message, copyData) => {
	let error;
	try {
		error = Errors.registerMessage(message, copyData);
	} catch(e) {
		console.error(`Failed to append an error log. Something went really wrong: `, message, copyData, e);
		alert(`A critical error occurred. Please report this issue to the devs. [Errors.report/registerMessage]`);
		return;
	}
	try {
		let showBtn = document.querySelector(Errors.config.showReporterSelector);
		if (showBtn) showBtn.classList.remove('hidden');
		if (Errors.Reporter.visible()) {
			if (Errors.log.length < Errors.config.maxLogs) {
				Errors.Reporter.messagesContainer().append(Errors.Reporter.createEntry(error));
			} else {
				Errors.Reporter.update();
			}
		}
	} catch(e) {
		console.error(`Failed to render and open in Error console. \nRendering error: `, e, `\n\nError log: `, Errors.log);
		alert(`A critical error occurred. Please report this issue to the devs. [Errors.report/displayMessage]`);
	}
}

{ /** Reporter DOM */
	/**
	 * These are utilities for making a plain old javascript "app" that displays and manages errors
	 */
	// making an additional namespace for this app. Note the scoping
	const Reporter = Errors.Reporter = {};

	Reporter.visible = function () {
		return !Reporter.reporterContainer().classList.contains('hidden');
	}
	Reporter.reporterContainer = function getReporter() {
		let reporterContainer = document.getElementById('error-reporter-container');
		if (!reporterContainer) {
			reporterContainer = document.createElement('div');
			reporterContainer.id = 'error-reporter-container';
			reporterContainer.className = "hidden";
			reporterContainer.innerHTML = `
				<div class="pane">
					<h3>Errors:</h3>
					<div class="messages"></div>
					<div class="actions">
						<div class="button close" onclick="Errors.Reporter.hide()">Close</div>
						<div class="button close" onclick="Errors.Reporter.hide(true)">Clear</div>
						<div class="button copy" onclick="Errors.Reporter.copyAll()">Copy</div>
						<textarea class="copy-area hidden"></textarea>
					</div>
				</div>`;
			document.querySelector('#story').insertAdjacentElement('afterbegin', reporterContainer);
		}
		return reporterContainer;
	}
	Reporter.messagesContainer = () => {
		return Reporter.reporterContainer().querySelector(`.messages`);
	}
	Reporter.paneContainer = () => {
		return Reporter.reporterContainer().querySelector(`.pane`);
	}
	Reporter.copyArea = () => {
		return Reporter.reporterContainer().querySelector('.copy-area')
	}
	Reporter.toggle = () => {
		if (Reporter.visible()) {
			Reporter.hide();
		} else {
			Reporter.show();
		}
	}
	Reporter.show = () => {
		Reporter.reporterContainer().classList.remove('hidden');
		Reporter.update();
	}
	Reporter.update = () => {
		const reports = Reporter.messagesContainer();
		reports.innerHTML = '';
		for (let error of Errors.log) {
			reports.append(Reporter.createEntry(error));
		}
	}
	Reporter.hide = (andClear) => {
		Reporter.reporterContainer().classList.add('hidden');
		Reporter.copyArea().classList.add('hidden')
		if (andClear) {
			Errors.log.splice(0);
			let showBtn = document.querySelector(Errors.config.showReporterSelector);
			if (showBtn) showBtn.classList.add('hidden');
		}
	}
	Reporter.createEntry = (error) => {
		const div = document.createElement("div");
		div.className = "message-entry";
		div.innerHTML = `<div class="message"></div>`;
		// This ensures that only text content is reported
		div.querySelector(".message").textContent = error.message;
		return div;
	}
	Reporter.copyAll = function() {
		const copyButton = Reporter.reporterContainer().querySelector('.button.copy');
		const copyArea = Reporter.copyArea();
		try {
			copyArea.textContent = JSON.stringify(Errors.log.map(e=>[e.message,e.copyData]), null, 2);
			copyArea.classList.remove('hidden');
			copyArea.focus();
			copyArea.select();
			document.execCommand('copy')
			copyButton.textContent = 'Copied!'
		} catch(e) {
			copyButton.textContent = 'Copy Failed :('
			alert(`Failed to copy to the clipboard. Try manually copying from the textarea, or if nothing has appeared, directly from Errors.log in the developer console.`)
		}
		setTimeout(() => {
			copyButton.textContent = 'Copy';
		}, 5000)
	}
}
