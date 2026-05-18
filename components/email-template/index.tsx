import type { EmailTemplateProps } from '@/types/components/email-template-type'

export function EmailTemplate({
  name,
  email,
  message,
  isAnonymous,
}: EmailTemplateProps) {
  return (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    }}
  >
    <h1
      style={{
        color: '#333',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
      }}
    >
      New Contact Form Submission
    </h1>

    <div style={{ marginTop: '20px' }}>
      <h2
        style={{
          color: '#555',
          fontSize: '18px',
          marginBottom: '15px',
        }}
      >
        {isAnonymous ? 'Anonymous Message' : 'Contact Information'}
      </h2>

      {!isAnonymous && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '5px 0' }}>
            <strong>Name:</strong> {name}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Email:</strong> {email}
          </p>
        </div>
      )}

      {isAnonymous && (
        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
          }}
        >
          <p style={{ margin: '0', color: '#666', fontStyle: 'italic' }}>
            This message was sent anonymously
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3
          style={{
            color: '#555',
            fontSize: '16px',
            marginBottom: '10px',
          }}
        >
          Message:
        </h3>
        <div
          style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            borderLeft: '4px solid #007bff',
            whiteSpace: 'pre-wrap' as const,
            lineHeight: '1.5',
          }}
        >
          {message}
        </div>
      </div>
    </div>

    <div
      style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
        fontSize: '12px',
        color: '#666',
      }}
    >
      <p>This message was sent from the Sami website contact form.</p>
      <p>Timestamp: {new Date().toLocaleString()}</p>
    </div>
  </div>
  )
}
