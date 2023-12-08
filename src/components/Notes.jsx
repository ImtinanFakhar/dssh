import React, { useState } from 'react';
import emailjs from 'emailjs-com';

function EmailForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState(null);

  const handleSendEmail = (e) => {
    e.preventDefault();
  
    emailjs
      .send(
        'service_w887nfy',
        'template_nr2p8a4',
        {
          to_email: email, 
          message: message,
          from_name: 'Raja Store' // Replace with the name of the sender
        },
        '2SfExqYFm1w17PWkQ'
      )
      .then((response) => {
        console.log('Email sent:', response);
        setAlert('Note sent successfully!');
      })
      .catch((error) => {
        console.error('Email error:', error);
        setAlert('Note could not be sent. Please try again.');
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-center mb-4">Send A Note</h2>
      {alert && (
        <div className={`bg-${alert.includes('successfully') ? 'green' : 'red'}-100 border-t-4 border-${alert.includes('successfully') ? 'green' : 'red'}-500 rounded-b text-${alert.includes('successfully') ? 'green' : 'red'}-900 px-4 py-3 shadow-md mb-4`} role="alert">
          <div className="flex">
            <div className="py-1">
              <svg
                className={`fill-current h-6 w-6 text-${alert.includes('successfully') ? 'green' : 'red'}-500 mr-4`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                {alert.includes('successfully') ? (
                  <path
                    fillRule="evenodd"
                    d="M3 11a9 9 0 1 1 6.17-2.82c.08.63.24 1.23.47 1.82a5.5 5.5 0 1 0-5.35 7.18 9 9 0 0 1-1.29-5.18c.41-.33.85-.62 1.29-.91zm9.19-4.47a1 1 0 0 1 1.41 1.41l-7 7a1 1 0 0 1-1.41-1.41l7-7z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10.293 1.293a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414-1.414L11.586 11l-6.293-6.293a1 1 0 0 1 0-1.414z"
                  />
                )}
              </svg>
            </div>
            <div>
              <p className="font-bold">{alert.includes('successfully') ? 'Success' : 'Error'}</p>
              <p className="text-sm">{alert}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSendEmail}>

        <textarea
          placeholder="Please include your email in the message so we can reach back to you"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 px-3 py-2 mt-4 border rounded-lg focus:outline-none focus:border-blue-400"
        />
        <button type="submit" className="w-full py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none">
          Send Note
        </button>
      </form>
    </div>
  );
}

export default EmailForm;
