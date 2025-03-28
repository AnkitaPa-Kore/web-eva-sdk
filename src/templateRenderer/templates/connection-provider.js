import { encodeHtml } from "../utils/helper";

import TemplateComponents from "./index";

function render(data) {
	const { providers, selectedProvider, status, validation } = data;

	return `
        <div class="connection-provider-template">
            ${renderHeader(data)}
            ${renderProvidersList(providers, selectedProvider)}
            ${renderConnectionForm(selectedProvider, validation)}
            ${renderActions(status, selectedProvider)}
        </div>
    `;
}

function renderHeader(data) {
	const { title, description, icon } = data;

	return `
        <div class="provider-header">
            ${
				icon
					? `
                <div class="header-icon">
                    <img src="${encodeHtml(icon)}" alt="Connection" />
                </div>
            `
					: ""
			}
            <div class="header-content">
                <h3 class="header-title">${encodeHtml(
					title || "Connect to Service"
				)}</h3>
                ${
					description
						? `
                    <p class="header-description">${encodeHtml(description)}</p>
                `
						: ""
				}
            </div>
        </div>
    `;
}

function renderProvidersList(providers, selectedProvider) {
	if (!providers?.length) return "";

	return `
        <div class="providers-list">
            ${providers
				.map(
					(provider) => `
                <div 
                    class="provider-item ${
						provider.id === selectedProvider?.id ? "selected" : ""
					}"
                    data-provider="${encodeHtml(provider.id)}"
                >
                    <div class="provider-logo">
                        <img 
                            src="${encodeHtml(provider.logo)}" 
                            alt="${encodeHtml(provider.name)}"
                        />
                    </div>
                    <div class="provider-info">
                        <div class="provider-name">${encodeHtml(
							provider.name
						)}</div>
                        ${
							provider.description
								? `
                            <div class="provider-description">
                                ${encodeHtml(provider.description)}
                            </div>
                        `
								: ""
						}
                    </div>
                    ${renderProviderStatus(provider)}
                </div>
            `
				)
				.join("")}
        </div>
    `;
}

function renderProviderStatus(provider) {
	const statusClasses = {
		connected: "status-connected",
		disconnected: "status-disconnected",
		error: "status-error",
	};

	return `
        <div class="provider-status ${statusClasses[provider.status] || ""}">
            ${
				provider.status === "connected"
					? `
                <span class="status-icon">✓</span>
                <span class="status-text">Connected</span>
            `
					: provider.status === "error"
					? `
                <span class="status-icon">!</span>
                <span class="status-text">Error</span>
            `
					: `
                <span class="status-icon">○</span>
                <span class="status-text">Not Connected</span>
            `
			}
        </div>
    `;
}

function renderConnectionForm(provider, validation) {
	if (!provider?.connectionFields) return "";

	return `
        <div class="connection-form">
            <h4 class="form-title">Connect to ${encodeHtml(provider.name)}</h4>
            ${provider.connectionFields
				.map((field) => renderConnectionField(field, validation))
				.join("")}
        </div>
    `;
}

function renderConnectionField(field, validation) {
	const fieldError = validation?.errors?.[field.name];

	return `
        <div class="form-field ${fieldError ? "has-error" : ""}">
            <label class="field-label" for="${field.name}">
                ${encodeHtml(field.label)}
                ${field.required ? '<span class="required">*</span>' : ""}
            </label>
            ${renderFieldInput(field)}
            ${
				field.description
					? `
                <div class="field-description">
                    ${encodeHtml(field.description)}
                </div>
            `
					: ""
			}
            ${
				fieldError
					? `
                <div class="field-error">${encodeHtml(fieldError)}</div>
            `
					: ""
			}
        </div>
    `;
}

function renderFieldInput(field) {
	switch (field.type) {
		case "text":
		case "email":
		case "password":
		case "number":
			return `
                <input 
                    type="${field.type}"
                    id="${field.name}"
                    name="${field.name}"
                    class="field-input"
                    value="${encodeHtml(field.value || "")}"
                    ${
						field.placeholder
							? `placeholder="${encodeHtml(field.placeholder)}"`
							: ""
					}
                    ${field.required ? "required" : ""}
                />
            `;

		case "select":
			return `
                <select 
                    id="${field.name}"
                    name="${field.name}"
                    class="field-select"
                    ${field.required ? "required" : ""}
                >
                    ${
						field.placeholder
							? `
                        <option value="" disabled ${
							!field.value ? "selected" : ""
						}>
                            ${encodeHtml(field.placeholder)}
                        </option>
                    `
							: ""
					}
                    ${field.options
						?.map(
							(option) => `
                        <option 
                            value="${encodeHtml(option.value)}"
                            ${option.value === field.value ? "selected" : ""}
                        >
                            ${encodeHtml(option.label)}
                        </option>
                    `
						)
						.join("")}
                </select>
            `;

		case "oauth":
			return `
                <button 
                    class="oauth-button"
                    data-provider="${encodeHtml(field.provider)}"
                    data-action="oauth"
                >
                    <img 
                        src="${encodeHtml(field.providerIcon)}" 
                        alt="${encodeHtml(field.provider)}"
                    />
                    Connect with ${encodeHtml(field.provider)}
                </button>
            `;

		default:
			return "";
	}
}

function renderActions(status, provider) {
	return `
        <div class="connection-actions">
            <button class="kr-secondary-btn btn-sm" data-action="cancel">
                Cancel
            </button>
            ${
				provider
					? `
                ${
					status === "connected"
						? `
                    <button class="kr-danger-btn btn-sm" data-action="disconnect">
                        Disconnect
                    </button>
                `
						: `
                    <button class="kr-primary-btn-black btn-sm" data-action="connect">
                        Connect
                    </button>
                `
				}
            `
					: ""
			}
        </div>
    `;
}

export { render };
