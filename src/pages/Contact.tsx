import React from "react";

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">We are here to support you. Reach out to us anytime:</p>
      <ul className="list-disc list-inside mb-4">
        <li>
          WhatsApp: <a href="https://wa.me/27713079555" className="text-blue-600 dark:text-blue-400 underline">+27713079555</a>
        </li>
        <li>
          Email: <a href="mailto:veerambaufx@gmail.com" className="text-blue-600 dark:text-blue-400 underline">veerambaufx@gmail.com</a>
        </li>
      </ul>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        We value your privacy and will respond as soon as possible.
      </p>
    </div>
  );
}
