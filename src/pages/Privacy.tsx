import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Your privacy is important to us. Whisper of Hope is committed to protecting your personal information and ensuring your experience is safe and secure.</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Information Collection</h2>
      <p className="mb-4">We only collect information necessary to provide our services. Your data is never sold or shared with third parties without your explicit consent.</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Data Security</h2>
      <p className="mb-4">All data is securely stored and access is restricted to authorized personnel only. We use industry-standard security measures to protect your information.</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Your Rights</h2>
      <p className="mb-4">You have the right to access, update, or delete your personal information at any time. Contact us if you have any privacy concerns.</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Contact</h2>
      <p className="mb-2">For privacy-related questions, contact us:</p>
      <ul className="list-disc list-inside mb-4">
        <li>WhatsApp: <a href="https://wa.me/27713079555" className="text-blue-600 dark:text-blue-400 underline">+27713079555</a></li>
        <li>Email: <a href="mailto:veerambaufx@gmail.com" className="text-blue-600 dark:text-blue-400 underline">veerambaufx@gmail.com</a></li>
      </ul>
      <p className="text-sm text-gray-600 dark:text-gray-300">By using this app, you agree to this privacy policy.</p>
    </div>
  );
}
