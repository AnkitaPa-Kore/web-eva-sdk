import { htmlDecode, renderIcons } from "../../utils/helpers";
import AnsFromChipFunctionality from "../functionality/ansFromChip";
import { getTimeline } from "../utils/helper";

const AnsFromChip = ({ item, regeneratingAnswer }) => {
	const regeneratingChipRenderer = () => {
		return `
            <div class="threadName">
                <span class="ansFrom">Answer from:</span>
                <span class="koraSpecDr">
                    <div class="contextIcon"></div>
                    <span class="krSpecName">${htmlDecode(
						regeneratingSelectedItem?.title || "No subject"
					)}</span>
                </span>
            </div>
        `;
	};

	const tableChipRenderer = () => {
		const source = item?.sources?.[0] || {};
		const attachment = source.source === "attachment";
		const icon = renderIcons(
			source.source,
			source.extIcon,
			source.providerIcon || source.icon
		).outerHTML;

		return `
            <div class="tableChipRenderer">
                <span class="datachip">${
					item?.sources?.length > 1 ? "Data:" : "Answer From:"
				}</span>
                <div class="contextIcon${attachment ? " attachment" : ""}">
                    ${icon}
                </div>
                <span class="krSpecName">${htmlDecode(
					source.title || ""
				)}</span>
            </div>
        `;
	};

	const ansFromChip = () => {
		if (item?.sources?.length > 1) {
			return `
                <div class="leftWrapperBlock" id = "ansFromChip-${item?.id}">
                    <span class="ansFrom">Answer From :</span>
                    <span class="krSpecName">${item?.sources?.length} Sources</span>
                </div>

            `;
		} else {
			return `<span class="ansFrom">Answer from :</span>`;
		}
	};

	const singleSourceChipRenderer = (source) => {
		// const attachment = source?.source === 'attachment';
		const warning = source?.warning;
		const icon = renderIcons(
			source.source,
			source.extIcon || source.iconUrl,
			source.providerIcon || source.icon
		).outerHTML;

		return `
            <div class="leftWrapperBlock">
                <span class="koraSpecDr${
					warning ? " fromWarning" : ""
				}" id = "ansFromChip-${item?.id}">
                    <div class="contextIcon">
                        ${icon}
                    </div>
                    <span class="krSpecName">${htmlDecode(
						source?.title || "No subject"
					)}</span>
                    ${
						warning
							? `<div class="warningText">${warning}</div>`
							: ""
					}
                </span>
            </div>
            </div>
        `;
	};

	const knowledgeChipRenderer = () => {
		let body = "";

		if (
			(!!item?.data?.length || item?.hasData) &&
			!item?.citationAnswers?.length
		) {
			body += `<div class="leftWrapperBlockCntr"><span class="ansFrom">Data:</span>`;
		} else {
			body += ansFromChip();
		}

		if (item?.sources?.length > 1 && item?.showMultiSourceList) {
			const multiSourceList = item?.sources
				?.map(
					(_, i) => `
                <div class="multiSourceListItem" key="${i}" id = "multiSourceListItem-${item?.id}-${_?.docId}">${_?.title}</div>
                <button class="askFollowupButton" id="askFollowupButton-${item?.id}-${_?.docId}" >Ask Followup</button>
            `
				)
				.join("");

			body += `<div class="MultiSourceListView">${multiSourceList}</div>`;
		}

		if (item?.sources?.length === 1) {
			body += singleSourceChipRenderer(item.sources[0]);
			if (item?.showData) {
				body += `<div class="chatFilterGroup">`;
				body += `<div class="threadListGroup">`;
				item?.data?.map((data, i) => {
					body += `<div class="threadListItem" key="${i}">
                                <div class='leftCol'>
                                ${renderIcons(data?.source, null)?.outerHTML}
                            </div>
                            <div class="rightCol">
                                <div class="leftDetails">
                                    <div class="namgeGroup">
                                        <div class="name" id = "listItem-${
											item?.id
										}-${data?.docId}">${data?.title}</div>
                                    </div>
                                    <div class='details'>
                                        <span class='dtName'>Sent by: 
                                            ${data?.fromEmail}, ${getTimeline(
						data?.date,
						"dayDateAndTime"
					)}
                                        </span>
                                    </div>
                                </div>
                                <div class="rightDetails">
                                    <div class="listView setContextDr">
                                        <div class="subText">
                                            <span class="dtText askFollowupButton"  id = "askFollowupButton-${
												item?.id
											}-${data?.docId}">Ask Followup
                                            </span>
                                        </div>
                                    </div> 
                                   <div class="openInNewTabIcon" id="openInNewTabIcon-${
										item?.id
									}-${data?.docId}">
                                        <span>
                                            <svg class="wa-ChangeLog" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5.83333 14.1667L14.1667 5.83334M14.1667 5.83334H5.83333M14.1667 5.83334V14.1667" stroke="#667085" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        </span>
                                   </div>
                                </div>
                            </div>
                        </div>`;
				});
				body += `</div>`;
				body += `</div>`;
			}
		}

		return `<div class="ansFromChip">${body}</div>`;
	};

	// <button class="askFollowupButton" id = "askFollowupButton-${
	//     item?.id
	// }-${data?.docId}">Ask Followup</button>
	const renderChip = () => {
		let chipHTML = "";

		if (regeneratingAnswer) {
			chipHTML = regeneratingChipRenderer();
		} else if (item?.viewType === "table") {
			chipHTML = tableChipRenderer();
		} else {
			chipHTML = knowledgeChipRenderer();
		}

		return `<div class="answerFromChipDiv">${chipHTML}</div>`;
	};

	let timeout;
	clearTimeout(timeout);
	timeout = setTimeout(() => {
		AnsFromChipFunctionality({
			item: item,
			regeneratingAnswer: regeneratingAnswer,
		});
	}, 1000);

	return renderChip();
};

export default AnsFromChip;
