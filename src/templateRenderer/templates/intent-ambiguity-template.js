// import { encodeHtml } from "../utils/helper";
import { encodeHtml } from "../utils/helper";
import TemplateComponents from "./index";

// import TemplateComponents from "./index";

function render(data) {
	const { intents, selectedIntent } = data;

	return `
        <div class="intent-ambiguity-template">
            <div class="intent-header">
                Please select what you'd like to do:
            </div>
            ${renderIntents(intents, selectedIntent)}
            ${renderActions()}
        </div>
    `;
}

function renderIntents(intents, selectedIntent) {
	if (!intents?.length) return "";

	return `
        <div class="intent-options">
            ${intents
				.map(
					(intent, index) => `
                <div class="intent-option ${
					selectedIntent === index ? "selected" : ""
				}"
                     data-intent-index="${index}">
                    <div class="intent-content">
                        ${
							intent.icon
								? `
                            <div class="intent-icon">
                                ${TemplateComponents.renderIcon(intent.icon)}
                            </div>
                        `
								: ""
						}
                        <div class="intent-details">
                            <div class="intent-title">${encodeHtml(
								intent.title
							)}</div>
                            ${
								intent.description
									? `
                                <div class="intent-description">${encodeHtml(
									intent.description
								)}</div>
                            `
									: ""
							}
                        </div>
                    </div>
                    <div class="intent-select">
                        ${TemplateComponents.renderIcon("CheckCircle")}
                    </div>
                </div>
            `
				)
				.join("")}
        </div>
    `;
}

function renderActions() {
	return `
        <div class="intent-actions">
            <button class="kr-secondary-btn btn-sm" data-action="cancel">
                Cancel
            </button>
            <button class="kr-primary-btn-black btn-sm" data-action="confirm">
                Proceed
            </button>
        </div>
    `;
}

export { render };
