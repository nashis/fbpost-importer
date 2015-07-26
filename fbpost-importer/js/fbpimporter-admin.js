window.onload = onWindowLoad;

var fbpImporterContainer
    , fbpImporterForm
    , fbpStatusContainer
    , fbpSuccessContainer
    , fbpErrorContainer
    ;

/**
 * All error messages consumed by UI
 * @type {{fbpimorter_url: string, fbpimorter_accesstoken: string}}
 */
var ERROR_MESSAGES = {
    'fbpimorter_url': 'Facebook Post URL',
    'fbpimorter_accesstoken': 'Facebook Access Token'
};
var errorMessages = [];

/**
 * Attach all event handlers for data validation and submission
 * @returns {undefined} for admin page, {boolean false} for other pages
 */
function onWindowLoad() {
    // Execute only in the context of settings for this plugin
    if (document.location.search.indexOf('page=FacebookPost_Importer') === -1) {
        return false;
    }

    fbpImporterContainer = document.getElementsByClassName('fbpimporter-admin')[0];
    fbpStatusContainer = fbpImporterContainer.getElementsByClassName('fbpimporter-status')[0];
    fbpSuccessContainer = fbpImporterContainer.getElementsByClassName('fbpimporter-success')[0];
    fbpErrorContainer =  fbpImporterContainer.getElementsByClassName('fbpimporter-error')[0];
    fbpImporterForm = fbpImporterContainer.getElementsByClassName('fbpimporter-form')[0];
    fbpImporterContainer.getElementsByClassName('fbpimporter-error-close')[0].addEventListener('click', hideErrorMessages);
    fbpImporterForm.addEventListener('submit', validateAndSubmitForm);
}

/**
 * Resets all data points related to status messages
 * @param {null}
 * @returns {undefined}
 */
function resetStatusUI() {
    errorMessages = [];
    fbpImporterContainer.getElementsByClassName('fbpimporter-error-msg')[0].innerHTML = '';
    hideSuccessMessages();
}

/**
 * Validate form, display errors or submit form for valid data
 * @param {Event evt} form submit event object
 * @returns {false} for validation errors, {undefined} for form submission
 */
function validateAndSubmitForm(evt) {
    resetStatusUI();
    evt.preventDefault();
    var formFields = fbpImporterContainer.getElementsByClassName('fbpimporter-form-field');

    if (formFields) {
        var fieldCount = formFields.length;
        for (var cnt=0; cnt < fieldCount; cnt++) {
            var formFieldInput = formFields[cnt].getElementsByTagName('input') && formFields[cnt].getElementsByTagName('input')[0];
            if (formFieldInput && !formFieldInput.value) {
                if (!errorMessages.length) {
                    formFieldInput.focus();
                }

                errorMessages.push(ERROR_MESSAGES[formFieldInput.getAttribute('name')]);
            }
        }

        if (errorMessages.length) {
            var errorMessageHtml = constructErrorMessageUI(errorMessages);
            fbpImporterContainer.getElementsByClassName('fbpimporter-error-msg')[0].appendChild(errorMessageHtml);
            showErrorMessages();

            return false;
        } else {
            fbpImporterForm.submit();
        }
    }
}

/**
 * Prepare all error messages based on validation that needs to be shown on the UI
 * @param {string errorMessages} list of error message
 * @returns {HTMLElement} error list node
 */
function constructErrorMessageUI(errorMessages) {
    var retValue = '';
    if (errorMessages) {
        var errorMsgParent = document.createElement('ul');
        errorMessages.forEach(function(errorMessage) {
            var errorMsgChild = document.createElement('li');
            errorMsgChild.appendChild(document.createTextNode(errorMessage));
            errorMsgParent.appendChild(errorMsgChild);
            errorMsgChild = null;
        });

        retValue = errorMsgParent;
    }

    return retValue;
}

/**
 * Show the error messages
 * @param {null}
 * @returns {undefined}
 */
function showErrorMessages() {
    showfbpStatusMessages();
    fbpErrorContainer.classList.remove('hide');
    fbpErrorContainer.classList.add('show');
}

/**
 * Hide the error messages
 * @param {null}
 * @returns {undefined}
 */
function hideErrorMessages() {
    hidefbpStatusMessages();
    fbpErrorContainer.classList.remove('show');
    fbpErrorContainer.classList.add('hide');
}

/**
 * Show the success messages
 * @param {null}
 * @returns {undefined}
 */
function showSuccessMessages() {
    showfbpStatusMessages();
    fbpSuccessContainer.classList.remove('hide');
    fbpSuccessContainer.classList.add('show');
}

/**
 * Hide the success messages
 * @param {null}
 * @returns {undefined}
 */
function hideSuccessMessages() {
    hidefbpStatusMessages();
    fbpSuccessContainer.classList.remove('show');
    fbpSuccessContainer.classList.add('hide');
}

/**
 * Show the status messages
 * @param {null}
 * @returns {undefined}
 */
function showfbpStatusMessages() {
    fbpStatusContainer.classList.remove('hide');
    fbpStatusContainer.classList.add('show');
}

/**
 * Hide the status messages
 * @param {null}
 * @returns {undefined}
 */
function hidefbpStatusMessages() {
    fbpStatusContainer.classList.remove('show');
    fbpStatusContainer.classList.add('hide');
}

