// mainly received from chatGPT

import React, { useState } from 'react';
import { BACKEND_URL } from '../connSettings'; 

interface InviteEmailProps {
  docId: string;
}

const InviteEmailComponent: React.FC<InviteEmailProps> = ({ docId }) => {
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  /** Send Invite Email using GraphQL mutation **/
  const sendInvite = async () => {
    if (!recipientEmail) {
      alert("Please enter an email address.");
      return;
    }

    const graphqlQuery = {
      query: `
        mutation {
          sendInvite(recipientEmail: "${recipientEmail}", documentLink: "${docId}")
        }
      `,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });

      const result = await response.json();
      if (response.ok && result.data) {
        setInviteStatus(result.data.sendInvite);
      } else {
        setInviteStatus("Failed to send invite.");
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      setInviteStatus("Error sending invite.");
    }
  };

  return (
    <div className="invite-section">
      <label htmlFor="inviteLink">Invite Link</label>

      <label htmlFor="email">Recipient's Email</label>
      <input
        type="email"
        id="email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        placeholder="Enter email to send invite"
      />

      <button onClick={sendInvite}>Send Invite</button>
      {inviteStatus && <p>{inviteStatus}</p>}
    </div>
  );
};

export default InviteEmailComponent;