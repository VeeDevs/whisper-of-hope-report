
import React from "react";

export default function Terms() {
	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
			<h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
			<p className="mb-4">
				Welcome to Whisper of Hope. By using this application, you agree to the following terms and conditions:
			</p>
			<h2 className="text-xl font-semibold mt-4 mb-2">Free Usage</h2>
			<p className="mb-4">
				This app is provided free of charge to all users. There are no fees or hidden costs associated with its use.
			</p>
			<h2 className="text-xl font-semibold mt-4 mb-2">No Political Affiliation</h2>
			<p className="mb-4">
				Whisper of Hope is a neutral platform. It is not affiliated with, nor does it support, any political movement, party, or agenda. The app is intended solely for community support and well-being.
			</p>
			<h2 className="text-xl font-semibold mt-4 mb-2">Privacy and Data Protection</h2>
			<p className="mb-4">
				We are committed to protecting your privacy. Any personal information or data you provide is securely stored and will not be shared with third parties without your explicit consent. Your data is used only to enhance your experience within the app.
			</p>
			<h2 className="text-xl font-semibold mt-4 mb-2">Contact</h2>
			<p className="mb-2">
				For any questions, concerns, or support, please contact us:
			</p>
			<ul className="list-disc list-inside mb-4">
				<li>
					WhatsApp: <a href="https://wa.me/27713079555" className="text-blue-600 underline">+27713079555</a>
				</li>
				<li>
					Email: <a href="mailto:veerambaufx@gmail.com" className="text-blue-600 underline">veerambaufx@gmail.com</a>
				</li>
			</ul>
			<p className="text-sm text-gray-600">
				By continuing to use this app, you acknowledge and accept these terms.
			</p>
		</div>
	);
}
