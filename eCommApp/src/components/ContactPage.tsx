import { useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const handleContinue = () => {
        setSubmitted(false);
        formRef.current?.reset();
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <h2>Contact Us</h2>
                <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                    <input type="text" name="name" placeholder="Your name" required />
                    <input type="email" name="email" placeholder="Your email" required />
                    <textarea name="request" placeholder="Your request" required />
                    <button type="submit">Submit</button>
                </form>
            </main>
            <Footer />
            {submitted && (
                <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="contact-thankyou">
                    <div className="modal-content">
                        <p id="contact-thankyou">Thank you for your message.</p>
                        <button onClick={handleContinue}>Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
