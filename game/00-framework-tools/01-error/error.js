/**
 * Error reporter utility that provides enriched error messages to the user as a simple sugarcube plugin app
 */
Errors.config = {
	// TODO: link this to an environment variable
	// for the time being, it can be enabled on console via `Errors.config.debug = true`
	debug: false,
	// by default, the error pane has no presence. Once an error is show, we leave
	// the open of hiding the pane, but will continue to display a tab to allow the
	// user the option of re-opening the pane.
	userHidden: false,
}
Errors.log = []
Errors.registerMessage = (message, copyData) => {
	const id = Errors.log.length;
	Errors.log.push({ message, copyData })
	return id;
}
Errors.report = (message, copyData) => {
	let id;
	try {
		id = Errors.registerMessage(message, copyData);
	} catch(e) {
		console.error(`Failed to append an error log. Something went really wrong: `, message, copyData);
		alert(`A critical error occurred. Please report this issue to the devs. [Errors.report/registerMessage]`);
	}
	try {
		Errors.Reporter.createEntry(id, message);
		Errors.Reporter.updateTab();
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

	Reporter.reporterContainer = function getReporter() {
		let reporterContainer = document.getElementById('error-reporter-container');
		if (!reporterContainer) {
			document.querySelector('#story').insertAdjacentHTML('afterbegin', `<div id='error-reporter-container'>
				<div class="pane-tab hidden" onclick="Errors.Reporter.showPane()"></div>
				<div class="pane hidden">
					<div class="messages"></div>
					<div class="actions">
						<div class="button close" onclick="Errors.Reporter.hidePane()">Close</div>
						<textarea class="copy-area hidden"></textarea>
					</div>
				</div>
			</div>`);
			reporterContainer = document.getElementById('error-reporter-container');
		}
		return reporterContainer;
	}
	Reporter.messagesContainer = () => {
		return Reporter.reporterContainer().querySelector(`.messages`);
	}
	Reporter.entryContainer = (id) => {
		return Reporter.reporterContainer().querySelector(`.message-entry[data-message-id="${id}"]`);
	}
	Reporter.paneContainer = () => {
		return Reporter.reporterContainer().querySelector(`.pane`);
	}
	Reporter.paneTab = () => {
		return Reporter.reporterContainer().querySelector(`.pane-tab`);
	}
	Reporter.copyArea = () => {
		return Reporter.reporterContainer().querySelector('.copy-area')
	}
	Reporter.showPane = () => {
		Reporter.paneContainer().classList.remove('hidden');
		Reporter.paneTab().classList.add('hidden');
	}
	Reporter.hidePane = () => {
		Reporter.paneContainer().classList.add('hidden');
		Reporter.paneTab().classList.remove('hidden');
		Reporter.copyArea().classList.add('hidden')
		Errors.config.userHidden = true;
	}
	Reporter.updateTab = () => {
		Reporter.paneTab().textContent = `Error Log: (${Errors.log.length})`
		if (!Errors.config.userHidden) {
			Reporter.paneContainer().classList.remove('hidden')
		}
	}
	Reporter.createEntry = (id, message) => {
		const reports = Reporter.messagesContainer();
		reports.insertAdjacentHTML('beforeend', `<div class="message-entry" data-message-id="${id}">
			<div class="message"></div>
			<div class="actions">
				<div class="button copy" onclick="Errors.Reporter.copy(${id})">Copy</div>
			</div>
		</div>`)
		const messageLocation = Reporter.entryContainer(id).querySelector(`.message`);
		// This ensures that only text content is reported
		messageLocation.textContent = message;
	}
	Reporter.copy = (id) => {
		const data = Errors.log[id];
		const entry = Reporter.entryContainer(id);
		const copyButton = entry.querySelector('.button.copy');
		const copyArea = Reporter.copyArea();
		copyArea.classList.remove('hidden');
		try {
			copyArea.textContent = JSON.stringify(data, null, 2);
			copyArea.focus();
			copyArea.select();
			document.execCommand('copy')
			copyButton.textContent = 'Copied!'
		} catch(e) {
			copyButton.textContent = 'Copy Failed :('
			alert(`Failed to copy to the clipboard. Try manually copying from the textarea, or if nothing has appeared, directly from Errors.log[${id}] in the developer console.`)
		}
		setTimeout(() => {
			copyButton.textContent = 'Copy';
		}, 5000)
	}
}
