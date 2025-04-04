import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initializeSDK } from "./index"; // Adjust the import according to your SDK setup

const getAccessToken =
	"GlMR8cbkAOwTz0x_x0uy2HMLO-7M52VNrcrUe9rQXXsdpHhPh7UvB0DCm8K4-DGT";
initializeSDK({
	accessToken: getAccessToken,
	api_url: "https://eva-qa.kore.ai/api/",
	presence_url: "https://eva-qa.kore.ai/",
	userId: "u-4acfa6cf-a881-5c6d-acfe-e6bb32aa6268",
	initializeBotSDK: {
		name: "ProcureBot",
		streamId: "st-b6012ef2-810d-5240-b33e-5404d68b680e",
		webhook: {
			clientId: "cs-79a89a6f-b0ab-5e2f-b912-8dd1e2f95da0",
			clientSecret: "VJNwkfbPcMZl4bOa1Qn3XtYRz6rqigwtTgOlaYX25Xs=",
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
