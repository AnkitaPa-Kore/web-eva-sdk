// import BotConversation from "../chat/botAgent/getBotConversation.js"
import { isEmpty } from "lodash";
import BotConversation from "../../chat/botAgent/getBotConversation";

function escapeHTML(str) {
	if (!str) return "";
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function createConversationHTML(
	conversation,
	props,
	assistantIconTemplate,
	userIconTemplate
) {
	if (
		(conversation?.hasOwnProperty("template_html") &&
			conversation?.status === "in-progress") ||
		conversation?.templateType === "hold_conversation"
	) {
		return `
            <div class="botTemplate-${conversation?.messageId}"></div>
        `;
	}

	if (conversation?.status === "completed") {
		if (conversation?.templateType === "search_answer") {
			return `
                <div>
					<div>
						${assistantIconTemplate}
						${escapeHTML(conversation?.question)}
					</div>
					<br>
					<div>
						${userIconTemplate}
                       ${escapeHTML(conversation?.answer)}
                    </div>
                </div>
            `;
		} else if (conversation?.templateType === "bot_template") {
			return `
				<div>
					${assistantIconTemplate}
					${conversation?.template_html}
				</div>
				<div>
					${userIconTemplate}
					${conversation?.answer}
				</div>
			`; // add pointer events none
		}
	}

	if (conversation?.status === "in-progress") {
		if (conversation?.templateType === "search_answer") {
			return `
					<div>
						${assistantIconTemplate}
						${escapeHTML(conversation?.question)}
					</div>
				`;
		}
	}

	return "";
}

function handleSubmit(conversation, input, props) {
	const payload = {
		cId: props?.cId || props?.reqId,
		input: input,
		context: props?.context,
		messageId: conversation?.messageId,
	};
	BotConversation().submitBotResponse(payload);
}

function setupEventListeners(botConversation, props) {
	// Input handlers
	document.querySelectorAll(".bot-input").forEach((input) => {
		input.addEventListener("keydown", (event) => {
			if (event.keyCode === 13 && !event.shiftKey) {
				event.preventDefault();
				const messageId = event.target.dataset.messageId;
				const conversation = Object.values(botConversation).find(
					(conv) => conv.messageId === messageId
				);

				if (conversation) {
					handleSubmit(conversation, event.target.value, props);
					event.target.value = "";
				}
			}
		});
	});

	// Button handlers
	document.querySelectorAll(".send-button").forEach((button) => {
		button.addEventListener("click", (event) => {
			const messageId = event.target.dataset.messageId;
			const input = document.querySelector(
				`.bot-input[data-message-id="${messageId}"]`
			);
			const conversation = Object.values(botConversation).find(
				(conv) => conv.messageId === messageId
			);

			if (conversation && input) {
				handleSubmit(conversation, input.value, props);
				input.value = "";
			}
		});
	});
}

function setupTemplates(botConversation) {
	if (!isEmpty(botConversation)) {
		const templateConversations = Object.values(botConversation)?.filter(
			(conversation) => conversation?.hasOwnProperty("template_html")
		);

		if (templateConversations?.length) {
			templateConversations.forEach((conversation) => {
				const templateDiv = document.querySelector(
					`.botTemplate-${conversation?.messageId}`
				);
				if (templateDiv && conversation?.template_html) {
					templateDiv.appendChild(conversation.template_html);
				}
			});
		}
	}
}

function renderBotConversation(props, assistantIconTemplate, userIconTemplate) {
	const botConversation = props?.botConversation;

	if (!Object.values(botConversation || {})?.length) {
		return "";
	}

	const conversationsHTML = Object.values(botConversation)
		.map((conversation) =>
			createConversationHTML(
				conversation,
				props,
				assistantIconTemplate,
				userIconTemplate
			)
		)
		.join("");

	return `
        <div class="bot-conversation-wrapper">
            ${conversationsHTML}
        </div>
    `;
}

// Main function to be exported
export function render(props, assistantIconTemplate, userIconTemplate) {
	const html = renderBotConversation(
		props,
		assistantIconTemplate,
		userIconTemplate
	);
	let timer;
	timer = setTimeout(() => {
		setupEventListeners(props?.botConversation, props);
		setupTemplates(props?.botConversation);
	}, 1000);
	return html;
}
export default { render };
