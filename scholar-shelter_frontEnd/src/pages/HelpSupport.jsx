import React, { useState  ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, MessageCircle, Mail, Phone, 
  ChevronDown, ChevronUp, ShieldCheck, LifeBuoy, Clock 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../App.css';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "How do I verify the authenticity of a PG listing?",
      a: "Every verified listing on Scholar Shelter undergoes a manual check by our team. Look for the 'Verified' badge on the property card. We also recommend visiting the property in person before making any advance payments."
    },
    {
      q: "Can I cancel a booking through the platform?",
      a: "Scholar Shelter currently acts as a discovery platform. Cancellation policies are managed directly by the PG owners. We recommend discussing refund terms clearly before finalizing your stay."
    },
    {
      q: "What documents do I need for a hostel admission?",
      a: "Common requirements include a valid Government ID (Aadhar/Passport), your College Admission Letter, and two passport-sized photographs. Specific requirements may vary by hostel."
    }
  ];
  useEffect(() => {
  const loadFaqs = async () => {
    try {
      const res = await axios.get("https://scholar-shelter.onrender.com/api/support/faqs");
      setFaqs(res.data);
    } catch (err) {
      console.error("Error loading FAQs");
    }
  };
  loadFaqs();
}, []);

  return (
    <div className="help-page-wrapper">
      <Navbar />

      {/* --- HIGH VISIBILITY SIDELINE BACK OPTION --- */}
      <div className="help-side-nav">
        <button className="back-action-btn" onClick={() => navigate(-1)}>
          <div className="back-btn-inner">
            <ArrowLeft size={24} />
          </div>
          <span>Return</span>
        </button>
      </div>

      <main className="help-main-content">
        {/* Hero Section */}
        <section className="help-hero-modern">
          <div className="status-badge">
            <span className="pulse-dot"></span> All Systems Operational
          </div>
          <h1>Help Center</h1>
          <p>Search for solutions or browse topics below</p>
          <div className="hero-search-box">
            <Search className="search-icon" />
            <input type="text" placeholder="Type your question (e.g., 'security deposit')..." />
          </div>
        </section>

        {/* Quick Contact Grid */}
        <section className="contact-grid-modern">
          <div className="contact-tile">
            <div className="tile-icon chat"><MessageCircle /></div>
            <h3>Live Support</h3>
            <p>Chat with our support team for urgent issues.</p>
            <button className="tile-link">Start Chat</button>
          </div>
          <div className="contact-tile">
            <div className="tile-icon mail"><Mail /></div>
            <h3>Email Us</h3>
            <p>Get a response within 24 hours.</p>
            <button className="tile-link">Open Ticket</button>
          </div>
          <div className="contact-tile">
            <div className="tile-icon phone"><Phone /></div>
            <h3>Call Hotline</h3>
            <p>Available Mon-Sat, 10AM - 7PM.</p>
            <button className="tile-link">+91 1800-000-000</button>
          </div>
        </section>

        {/* FAQ & Trust Section */}
        <section className="faq-and-trust">
          <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-accordion">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-block ${activeFaq === index ? 'expanded' : ''}`}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <div className="faq-header">
                    <h4>{faq.q}</h4>
                    {activeFaq === index ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  <div className="faq-body">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="trust-sidebar">
            <div className="trust-card">
              <ShieldCheck className="trust-icon" />
              <h4>Safety First</h4>
              <p>Your data and transactions are secured with 256-bit encryption.</p>
            </div>
            <div className="trust-card">
              <LifeBuoy className="trust-icon" />
              <h4>24/7 Monitoring</h4>
              <p>We actively flag suspicious listings to keep you safe.</p>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HelpSupport;