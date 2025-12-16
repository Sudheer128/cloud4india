#!/usr/bin/env node

/**
 * Create database tables for Integrity Pages CMS
 * This script creates tables for Privacy Policy, AUP, MSA & SLA, Terms, Refund Policy
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path - use environment variable or default to local path
const DB_PATH = process.env.DB_PATH || './cms.db';

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Integrity Pages table
      db.run(`CREATE TABLE IF NOT EXISTS integrity_pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating integrity_pages table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created integrity_pages table');
        }
      });

      // Privacy Policy default content
      const privacyContent = `<h1>Privacy Policy</h1>

<p>Read Cloud4India's Privacy Policy to understand how we collect, use, & protect your personal information. Transparency & data security are our priorities.</p>

<h2>Privacy & Policy</h2>

<p><strong>Effective date:</strong> 1 January 2024</p>

<p>CLOUD 4 INDIA is committed to protecting the personal information of our customers, employees and other individuals. When you conduct business with CLOUD 4 INDIA You can be assured that your privacy is protected. We respect your right to control the collection and use and disclosure of your personal information. CLOUD 4 INDIA is committed to protecting your privacy and safeguarding your personal information. CLOUD 4 INDIA has implemented the below "Privacy Code" to comply with the Personal Information. Protection and Electronic Documents Act (PIPEDA) which came into effect January 1, 2004. CLOUD 4 INDIA respects the privacy of our clients and we are committed to keeping your personal information private, secure, accurate, and confidential.</p>

<h3>What Is Personal Information?</h3>

<p>Personal information includes any factual or subjective information, recorded or not, about an identifiable individual. This includes information in any form, such as: age, name, ID numbers, income, ethnic origin, or blood type, opinions, evaluations, comments, social status, or disciplinary actions, employee files, credit records, loan records, medical records, existence of a dispute between a consumer and a, intentions (for example, to acquire goods or services, or change jobs), Personal information does not include the name, title, business address or telephone number of an employee of an organization.</p>

<h3>Information We May Collect And What We Do With Such Information</h3>

<p>We collect and use information about you and your use of our website and our products and services (herein called "Information") to:<br>
(i) initiate and maintain a business relationship with you as our customer in connection with our products and services.<br>
(ii) Provide you with personalized services and product offerings by use of direct marketing to our current customer base, as well as new potential customers.<br>
(iii) Comply with any legal requirements or requests due to a legal proceeding.</p>

<p>The Personal Information Protection and Electronic Documents Act utilizes the model code from the Canadian Standards Association(CSA). The code was developed by business, consumers, academics and government under the auspices of the Canadian Standards Association. It lists 10 principles of fair information practices, which form ground rules for the collection, use and disclosure of personal information. These principles give individuals control over how their personal information is handled in the private sector. An organization is responsible for the protection of personal information and the fair handling of it at all times, throughout the organization and in dealings with third parties. Care in collecting, using and disclosing personal information is essential to continued consumer confidence and good will.</p>

<p>To view the Personal Information and Electronic Document Act, click here now.</p>

<h3>CLOUD 4 INDIA takes our Privacy code seriously, which is based on the below 9 principles:</h3>

<ol>
  <li><strong>Accountability</strong><br>
  CLOUD 4 INDIA is responsible for information under our control. We have assigned an individual who is accountable for our organization's compliance to the Privacy Principles set out by the Personal Information Protection and Electronic Documents Act.</li>
  
  <li><strong>Identifying purposes</strong><br>
  Whenever we collect information from a customer or potential customer we identify the purpose for which the information will be used.</li>
  
  <li><strong>Consent</strong><br>
  Consent and knowledge of the individual is required before we collect or disclose any personal information, except in cases where it is inappropriate.</li>
  
  <li><strong>Limiting collection</strong><br>
  We only collect information that is necessary for the purpose identified by our organization.</li>
  
  <li><strong>Limiting use, disclosure, and retention</strong><br>
  Just as CLOUD 4 INDIA takes steps to limit the types of information we collect from you, we carefully regulate how we handle your personal information. We do not use your information for purposes other than those to which you have consented, or as required by law (for example in a legal investigation). Should CLOUD 4 INDIA require the services of third parties to handle your information, we will require them to adhere to privacy procedures that will keep your information confidential. These third parties will be given only the information necessary for performing their information-handling services. CLOUD 4 INDIA does not sell or trade personal information for commercial purposes. CLOUD 4 INDIA is committed to retaining your personal information only as long as is necessary for the purposes for which it was collected. CLOUD 4 INDIA is also committed to deleting or destroying the records containing that information when they are no longer required; this will be done in ways that will ensure your continued privacy.</li>
  
  <li><strong>Accuracy</strong><br>
  We are committed to ensuring that our records of your personal information are accurate, complete, and up-to-date. Although it is your responsibility to inform CLOUD 4 INDIA of any relevant changes in your personal information, we will take steps to ensure that you are able from time to time to verify the information in your file.</li>
  
  <li><strong>Safeguards</strong><br>
  CLOUD 4 INDIA uses appropriate safeguards to protect the privacy of your personal information. These safeguards are designed to prevent unauthorized access, disclosure, copying, use, or modification. Your records are accessible only to staff who have been given the authority to access them and only as is necessary to provide services to you.</li>
  
  <li><strong>Openness</strong><br>
  So that you can be confident that CLOUD 4 INDIA is handling your personal information appropriately, CLOUD 4 INDIA will make information about its policies and practices concerning management of personal information readily available to you. As such, CLOUD 4 INDIA lists our policies on our website for viewing 24 hours a day, 7 days a week for reading by all.</li>
  
  <li><strong>Individual access</strong><br>
  If at any time you have a question about our records containing your personal information, we will do our best to answer it. You have the right to be told about the kind of personal information. CLOUD 4 INDIA maintains, how it is used, and with whom it is shared. You are entitled to challenge the factual accuracy as well as the completeness and relevance of our records. Incorrect information will be promptly corrected or, if necessary, deleted. In special circumstances, CLOUD 4 INDIA may need to refuse or limit an access request, for example when disclosure of the information will reveal personal information about another person or interfere with a legal investigation. Most inquiries about our records containing your personal information will be answered at no cost to you. In special circumstances, however, it may be necessary to charge a fee, for example when a lot of staff time is required to gather requested information. If a fee is necessary, you will be told in advance.</li>
</ol>`;

      // Acceptance User Policy default content
      const aupContent = `<h1>Acceptance User Policy</h1>

<p>Any amendment or modification of this AUP shall be effective only if it is in writing and duly signed by both the Parties.</p>

<h2>Acceptance User Policy</h2>

<ol>
  <li>This Acceptable User Policy ("AUP") governs the usage of services of Cloud 4 India ("Services") pursuant to the Master Services Agreement dated Date entered between Cloud 4 India, hereby referred as 'Service Provider' and CUSTOMER NAME hereby referred to as 'Customer'.<br>
  The terms not specifically defined herein shall have the meanings ascribed to them in the Master Services Agreement.</li>
  
  <li>This AUP shall be incorporated by reference into each contract entered by CLOUD 4 INDIA with its Customer for availing the Services. In addition, this Policy shall also be incorporated by reference into the Master Service Agreement</li>
  
  <li>This AUP helps and protects the Customer. Availing of Services by the Customer constitutes acceptance of this AUP.</li>
  
  <li>All hosting services provided by CLOUD 4 INDIA shall be used by the Customer for lawful purposes only, and as per the applicable laws (including but not limited to privacy laws). Transmission, usage, storage, or presentation of any information, data or material in violation of applicable laws including the 'banned contents' is strictly prohibited. The 'banned contents' include but are not limited to:
    <ol type="a">
      <li><strong>Illegal Material</strong>– Includes illegally exploited copyrighted works, commercial audio, video, or music files, and any material that violates any applicable law or regulation of any country, and any material that is perceived to be misleading in any manner.</li>
      <li><strong>Warez</strong> – Includes, but is not limited to, pirated software, ROMS, emulators, phreaking, hacking, password cracking, IP spoofing and the like, and encrypting of any of the above. It also includes any sites which provide "links to" or "how to" information about such material.</li>
      <li><strong>HYIP</strong> – HYIP sites, or sites that link to or have content related to HYIP sites.</li>
      <li><strong>Proxy</strong> – Any proxy set-ups or connections or any sort of activity through remote proxy connections on our hosting and/or in relation to our Colocation services.</li>
      <li><strong>IRC Hosts</strong> – (Hosting an IRC server that is part of or connected to another IRC network or server) Servers, found to be (a) connecting to or (b) part of these networks;</li>
      <li><strong>Defamatory content</strong> – any website content that makes a false claim, expressively stated or implied to be factual, or that may give an individual, business, product, services, group, government or nation a negative image.</li>
      <li><strong>Bit Torrents</strong> – Use of software and scripts for "bit torrents" including sending or receiving files using these mechanisms.</li>
    </ol>
  </li>
  
  <li><strong>Adult Content</strong><br>
  CLOUD 4 INDIA does not allow pornographic or sexually-explicit images or any pictures/ video which are obtained illegally to be hosted on its servers.</li>
  
  <li><strong>Undertaking of the Customer</strong><br>
  The Customer agrees and undertakes that;
    <ol type="a">
      <li>Any attempt to undermine or cause harm to any of the servers of CLOUD 4 INDIA is strictly prohibited. CLOUD 4 INDIA shall take no responsibility for the use of its clients' accounts by the Customer.</li>
      <li>In case of abuse of the resources provided by CLOUD 4 INDIA., in any way, CLOUD 4 INDIA reserves the unqualified right to immediately deactivate the Customer's account, without refund.</li>
      <li>Denial of Service (DOS) attacks directed at CLOUD 4 INDIA., or any attempt to launch a DOS attack from CLOUD 4 INDIA servers are strictly prohibited. All infractions and or suspected infractions will be vigorously investigated and may result in immediate termination of Customer's account.</li>
      <li>In case the Customer is, in any way, disrespectful towards any member of CLOUD 4 INDIA or its staff, CLOUD 4 INDIA shall have full right to terminate Customer's account with it, without any refund.</li>
      <li>CLOUD 4 INDIA. will use reasonable efforts to protect and backup data for its clients / Customer on a regular basis, however, CLOUD 4 INDIA does not guarantee the existence, accuracy, or regular maintenance thereof.</li>
      <li>Use or distribution of tools designed for compromising security is prohibited. Such tools shall include but are not limited to password guessing programs, cracking tools or network probing tools.</li>
      <li>It shall not attempt to interfere with services provided to any user, host or network or carry out DOS attacks which includes but is not limited to "flooding" of networks, deliberate attempts to overload a service, and attempts to "crash" a host.</li>
      <li>Users who violate systems or network security may incur criminal or civil liability. CLOUD 4 INDIA will cooperate fully with investigations of violations of systems or network security at other sites, including cooperating with law enforcement authorities in the investigation of suspected criminal violations.</li>
      <li>It shall complete its own tests for computer viruses in accordance with best computing practice prior to each and every operational use of the Services</li>
    </ol>
  </li>
  
  <li><strong>Materials and Products</strong>
    <ol type="a">
      <li>CLOUD 4 INDIA. shall exercise no control whatsoever over the content of the information passing through the network or on the Customer's websites.</li>
      <li>Use of any information obtained by way of CLOUD 4 INDIA is at the Customer's own risk, and CLOUD 4 INDIA specifically denies any responsibility for the accuracy or quality of information obtained through its services.</li>
      <li>Connection speed represents the speed of connection to CLOUD 4 INDIA and does not represent guarantees of available end to end bandwidth. CLOUD 4 INDIA can only guarantee within its controlled network, availability of bandwidth to Customer's subscribed Committed Information Rate".</li>
    </ol>
  </li>
  
  <li>CLOUD 4 INDIA is under no obligation to edit, review or modify the contents of the Customer's website. However, CLOUD 4 INDIA reserves the right to remove any content on the Customer's website without notice. For the avoidance of doubt, CLOUD 4 INDIA shall not pro-actively monitor messages that are posted on the sites managed by CLOUD 4 INDIA, but it reserves the right to remove such messages at its sole discretion, without notice to the Customer.</li>
  
  <li>The Account of the Customer found to be using the Services for any of the purposes contained in Clause (IV) (i), above shall be terminated without any notice.</li>
  
  <li>The first offense committed by the Customer in respect of Proxy as set out in Clause IV (iv), above will result in immediate suspension of their account. A second violation by the Customer in this regard will result in immediate termination of its account.</li>
  
  <li>Servers found to be (a) connecting to, or (b) part of another IRC network or server will be immediately removed from CLOUD 4 INDIA network, without notice. Such servers will not be reconnected to the network until such time that all traces of the IRC server are completely removed, and the Customer allows access to its server to confirm that the content has been completely removed.</li>
  
  <li><strong>Indemnity</strong><br>
  The Customer agrees that it shall fully and effectively defend, indemnify, save and hold
    <ol type="a">
      <li>CLOUD 4 INDIA harmless from any and all demands, liabilities, losses, costs, actions, proceedings, expenses (including legal expenses), liabilities and/or claims, howsoever suffered or incurred directly or indirectly by CLOUD 4 INDIA, its agents, officers and employees, that may arise or result from any acts or omissions of the Customer, its agents, employees or assigns (a) in connection with their use of the Services, and/or (b) as a consequence of the Customers breach or non- observance of its obligations set out in this AUP.</li>
      <li>The Customer shall defend and pay all costs, damages, awards, fees (including legal expenses) and judgments awarded against CLOUD 4 INDIA arising from breach or breaches of its obligations set out in this AUP. CLOUD 4 INDIA may in its absolute discretion defend such claims and may compromise such claims without the consent of the Customer. The Customer shall provide CLOUD 4 INDIA with the assistance necessary, or as required by CLOUD 4 INDIA, to defend such claims, at the Customer's sole expense.</li>
    </ol>
  </li>
  
  <li><strong>Amendment</strong><br>
  Any amendment or modification of this AUP shall be effective only if it is in writing and duly signed by both the Parties.</li>
</ol>`;

      // Terms & Conditions default content (using placeholder for now, will need actual content)
      const termsContent = `<h1>Terms & Conditions</h1>

<p>Please read these Terms and Conditions carefully before using Cloud 4 India services.</p>

<h2>Terms of Service</h2>

<p>By accessing and using the services provided by Cloud 4 India, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access our services.</p>

<h3>1. Service Agreement</h3>
<p>These Terms and Conditions, together with the Master Services Agreement (MSA) and Acceptable Use Policy (AUP), constitute the entire agreement between you and Cloud 4 India regarding the use of our services.</p>

<h3>2. Service Availability</h3>
<p>While we strive to maintain high availability of our services, we do not guarantee uninterrupted, secure, or error-free service. Service availability may be affected by factors beyond our control.</p>

<h3>3. User Responsibilities</h3>
<p>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>

<h3>4. Intellectual Property</h3>
<p>All content, features, and functionality of our services are owned by Cloud 4 India and are protected by international copyright, trademark, and other intellectual property laws.</p>

<h3>5. Limitation of Liability</h3>
<p>Cloud 4 India shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.</p>

<h3>6. Modifications to Terms</h3>
<p>Cloud 4 India reserves the right to modify these Terms and Conditions at any time. We will notify users of any material changes via email or through our website.</p>

<h3>7. Governing Law</h3>
<p>These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

<h3>8. Contact Information</h3>
<p>If you have any questions about these Terms and Conditions, please contact us through our website or customer support.</p>`;

      // MSA & SLA default content (using placeholder for now, will need actual content)
      const msaSlaContent = `<h1>MSA & SLA</h1>

<p>Master Services Agreement and Service Level Agreement</p>

<h2>Master Services Agreement (MSA)</h2>

<p>The Master Services Agreement establishes the general terms and conditions under which Cloud 4 India provides services to its customers.</p>

<h3>1. Definitions</h3>
<p>This agreement defines the relationship between Cloud 4 India (Service Provider) and the Customer, including all services, responsibilities, and obligations of both parties.</p>

<h3>2. Service Provision</h3>
<p>Cloud 4 India agrees to provide cloud computing, hosting, and related services as specified in the individual service agreements and addendums.</p>

<h3>3. Customer Obligations</h3>
<p>The Customer agrees to comply with all terms outlined in this MSA, the Acceptable Use Policy, and any applicable service agreements.</p>

<h2>Service Level Agreement (SLA)</h2>

<h3>1. Uptime Guarantee</h3>
<p>Cloud 4 India guarantees 99.99% uptime for our cloud infrastructure services, excluding scheduled maintenance windows.</p>

<h3>2. Maintenance Windows</h3>
<p>Scheduled maintenance will be communicated to customers at least 48 hours in advance. Emergency maintenance may be performed with immediate notification.</p>

<h3>3. Service Credits</h3>
<p>If we fail to meet our uptime guarantee, eligible customers may be entitled to service credits as outlined in their specific service agreement.</p>

<h3>4. Support Response Times</h3>
<p>Cloud 4 India provides 24/7 technical support with the following response time targets:
<ul>
  <li>Critical Issues: 1 hour</li>
  <li>High Priority: 4 hours</li>
  <li>Medium Priority: 8 hours</li>
  <li>Low Priority: 24 hours</li>
</ul>
</p>

<h3>5. Data Backup</h3>
<p>Cloud 4 India performs regular backups of customer data. However, customers are encouraged to maintain their own backup copies of critical data.</p>

<h3>6. Security</h3>
<p>Cloud 4 India implements industry-standard security measures to protect customer data and infrastructure. Detailed security policies are available upon request.</p>

<h3>7. Changes to SLA</h3>
<p>Any changes to this SLA will be communicated to customers in writing at least 30 days before implementation.</p>`;

      // Refund Policy default content (using placeholder for now, will need actual content)
      const refundContent = `<h1>Refund Policy</h1>

<p>Cloud 4 India's refund policy outlines the terms and conditions under which refunds may be issued for our services.</p>

<h2>Refund Eligibility</h2>

<h3>1. Money-Back Guarantee</h3>
<p>Cloud 4 India offers a 30-day money-back guarantee for new customers on select services. This guarantee applies to the first 30 days of service from the initial sign-up date.</p>

<h3>2. Eligible Services</h3>
<p>The money-back guarantee applies to:
<ul>
  <li>Cloud hosting services</li>
  <li>VPS hosting services</li>
  <li>Basic cloud servers</li>
</ul>
</p>
<p>Some specialized services and add-ons may not be eligible for refunds. Please check with our support team for specific service eligibility.</p>

<h3>3. Refund Request Process</h3>
<p>To request a refund:
<ol>
  <li>Submit a refund request through the customer portal or by contacting support</li>
  <li>Provide your account information and reason for the refund request</li>
  <li>Our team will review your request within 5 business days</li>
  <li>If approved, refunds will be processed within 10 business days</li>
</ol>
</p>

<h3>4. Non-Refundable Items</h3>
<p>The following are not eligible for refunds:
<ul>
  <li>Services used beyond the money-back guarantee period</li>
  <li>Domain registration fees</li>
  <li>SSL certificates</li>
  <li>Setup fees for custom configurations</li>
  <li>Services terminated due to violation of Terms of Service</li>
</ul>
</p>

<h3>5. Partial Refunds</h3>
<p>Partial refunds may be issued in certain circumstances, such as:
<ul>
  <li>Pro-rated refunds for unused portions of prepaid services</li>
  <li>Refunds for service downgrades (subject to terms)</li>
</ul>
</p>

<h3>6. Refund Method</h3>
<p>Refunds will be issued to the original payment method used for the transaction. Processing times may vary depending on the payment method and financial institution.</p>

<h3>7. Chargebacks</h3>
<p>Customers are encouraged to contact Cloud 4 India support before initiating a chargeback with their payment provider. We will work to resolve any issues amicably.</p>

<h3>8. Cancellation</h3>
<p>You may cancel your service at any time through the customer portal. Cancellation does not automatically entitle you to a refund unless you are within the money-back guarantee period.</p>

<h3>9. Contact Us</h3>
<p>For questions about our refund policy or to request a refund, please contact our support team through the customer portal or via email.</p>`;

      // Insert default pages
      const pages = [
        { slug: 'privacy', title: 'Privacy Policy', content: privacyContent },
        { slug: 'acceptance-user-policy', title: 'Acceptance User Policy', content: aupContent },
        { slug: 'msa-sla', title: 'MSA & SLA', content: msaSlaContent },
        { slug: 'terms', title: 'Terms & Conditions', content: termsContent },
        { slug: 'refund-policy', title: 'Refund Policy', content: refundContent }
      ];

      const insertPage = db.prepare(`INSERT OR REPLACE INTO integrity_pages (slug, title, content, is_visible) VALUES (?, ?, ?, 1)`);
      pages.forEach(page => {
        insertPage.run(page.slug, page.title, page.content);
      });
      insertPage.finalize((err) => {
        if (err) {
          console.error('Error inserting integrity pages:', err.message);
          reject(err);
        } else {
          console.log('✅ Inserted default integrity pages');
          console.log('\n🎉 All Integrity pages tables created and populated with default data!');
          resolve();
        }
      });
    });
  });
};

// Run migrations
createTables()
  .then(() => {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
        process.exit(1);
      }
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err.message);
    db.close();
    process.exit(1);
  });

