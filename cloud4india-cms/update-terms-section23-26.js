/**
 * Update Terms & Conditions - Add Sections 23-26
 * Based on uploaded images - content after section 22
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

// Complete content for sections 23-26 (including c) Indian Penal Code continuation)
const additionalSections = `

<h3>c) Indian Penal Code, 1860</h3>

<ul>
<li><strong>Hate Speech and Harassment:</strong> Prohibition of content that includes hate speech, threats, harassment, discrimination, or promotes violence against individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, etc. <strong>Section 153A IPC, 1860</strong> attempts to punish those who engage in promoting any kind of enmity among different groups based on religion, caste, race, place of birth or residence, or even language. The provision puts liability on those who:
<ol style="list-style-type: upper-alpha;">
<li>Spread enmity in the form of words (spoken or written), visual representations, and signs to cause disharmony, hatred or disturbance among people belonging to different groups, religions, castes or communities.</li>
<li>Spread disharmony and disturb the public tranquility of the people belonging to different racial and religious groups.</li>
<li>Aid in the organizing of certain movements, and drills that encourage as well as train the participants of such movements to use criminal force and violence upon people belonging to other racial and religious groups and communities.</li>
<li>Considering the serious nature of this offense, the accused shall be entitled to a punishment of imprisonment that may extend up to three years or a fine or both.</li>
</ol>
</li>
</ul>

<hr>

<h2>23. COMPLIANCE WITH CERT-IN DIRECTIONS</h2>

<p>The customer hereby agree and warrant to comply with the following directions contained in Cert In directions dated April 28, 2022 and produce the relevant records as when asked by the Company pursuant to any verbal or written order of a Government authority:-</p>

<p><strong>23.1</strong> customer agree to enable logs of all their ICT systems and maintain them securely for a rolling period of 180 days and the same shall be maintained within the Indian jurisdiction.</p>

<p><strong>23.2</strong> customer agree to maintain the following accurate information which must be maintained by them for a period of 5 years or longer duration as mandated by the law after any cancellation or withdrawal of the registration as the case may be in respect of the end-users of services provided by Cloud 4 India:-</p>
<ol style="list-style-type: lower-alpha;">
<li>Validated names of subscribers/customers hiring the services</li>
<li>Period of hire including dates</li>
<li>IPs allotted to / being used by the members</li>
<li>Email address and IP address and time stamp used at the time of registration / on-boarding</li>
<li>Purpose for hiring services</li>
<li>Validated address and contact numbers</li>
<li>Ownership pattern of the subscribers / customers hiring services</li>
</ol>

<hr>

<h2>24. OTHER OBLIGATIONS OF CUSTOMERS</h2>

<p><strong>24.1</strong> The customer shall provide the services only to the following type of users:-</p>
<ol style="list-style-type: lower-alpha;">
<li><strong>End Users:</strong> End users shall mean those individuals or entities who are taking services for their own use and shall exclude customers who offer Cloud Infrastructure Services or similar services like WebHosting to their clients.</li>
<li><strong>Managed Service Providers (MSPs):</strong> The Customer can provide the services to MSPs who are not end users but manage infrastructure for their clients.</li>
</ol>

<p><strong>24.2</strong> Customers are not allowed to provide Cloud 4 India services/Infrastructure to any customer located outside India.</p>

<p><strong>24.3</strong> Customers shall ensure that all its end-users directly or indirectly using Cloud 4 India services are bound by Terms of Service similar to that of Cloud 4 India Terms of Services and that all provisions of Cloud 4 India Terms of Services are complied by all its end-users.</p>

<p><strong>24.4</strong> In case of any seizure of hardware provided by Cloud 4 India to customer by any Government Authority, for the purpose of an investigation against customer, its agents or End Users, or for any other purpose as per the requirement of the Government Authority, the customer shall be liable to pay, without any protest or demur, upfront the amount decided by Cloud 4 India, in its sole discretion, as:</p>
<ol style="list-style-type: lower-roman;">
<li>The cost of storage which is used by Cloud 4 India to provide requested data or information to the Government Authority, and</li>
<li>the cost of server or equipment seized by the Government Authority, and</li>
<li>the cost of effort made by Cloud 4 India professionals to arrange/provide the requested data including transportation cost if any.</li>
</ol>

<h3>24.5 Prohibited Activities/Workloads</h3>
<p>The customer agree and warrant that customer will ensure that Cloud 4 India infrastructure or services are not being used by any of its end-users for prohibited activities including but not limited to the following:-</p>
<ol style="list-style-type: lower-alpha;">
<li>Crypto-currency</li>
<li>Adult sites</li>
<li>Chance based gaming</li>
<li>VOIP Solutions</li>
<li>UDP Based Gaming</li>
<li>Reseller Hosting</li>
<li>Use, provisioning or enablement of any software or techniques for anonymization specifically used to hide end-user real IP address for posting or publishing any content or performing any interactions with third parties where identification is generally required is prohibited including but not limited to use of VPN software like Open VPN, OpenVPN, proxy software, public VPNs, Tor nodes, torrent nodes etc.</li>
<li>Un-managed Shared Hosting</li>
</ol>

<p>However, anonymization can be used on datastores where anonymization is specifically required to meet the requirements of the law</p>

<p><strong>The above is not a comprehensive list of prohibited activities and all activities as prohibited by law or under Cloud 4 India Terms of Services shall be considered as prohibited activities for the purpose of this clause.</strong></p>

<hr>

<h2>25. INDEMNITY</h2>

<p><strong>25.1</strong> You shall defend, indemnify, and hold harmless the Company, its affiliates/subsidiaries/joint venture partners and each of its, and its affiliates'/subsidiaries'/joint venture partners' employees, contractors, directors, suppliers and representatives from all liabilities, losses, claims, and expenses, including reasonable attorneys' fees, that arise from or relate to (i) Your use or misuse of, or access to, the Services, Software and Platform; or (ii) Your violation of the Terms and Conditions; or any applicable law, contract, policy, regulation or other obligation including that of the Third Party Platforms. We reserve the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by You, in which event You will assist and cooperate with Us in connection therewith.</p>

<p><strong>25.2</strong> Cloud 4 India does not provide any representation or warranty in respect of any products or services provided by others. Cloud 4 India shall have no obligation for loss, liability or damage which results because:</p>
<ol style="list-style-type: lower-alpha;">
<li>Customer fails to utilize, operate or maintain the Services or any materials or equipment in connection with the Services in accordance with (i) applicable law and generally approved industry practices or (ii) the provisions of this Agreement or (iii) the provisions of any storage, operating or maintenance instructions furnished to Customer or (iv) data loss or business loss due to disaster or cyber-attacks (force majeure clause applies)</li>
<li>Customer breaches applicable law. Customer agrees to indemnify WSIPL against any loss, liability, harm or damage that WSIPL may suffer as a result of Customer's failure or breach as described in this clause.</li>
</ol>

<hr>

<h2>26. MISCELLANEOUS</h2>

<p><strong>26.1 Entire Agreement:</strong> These Terms, together with Company Policies and any other documents expressly referred herein, constitute the entire understanding between the parties with respect to the subject matter hereof. In addition, the terms and conditions as set forth in any invoice, or any other official communications in writing between you and us, including payment reminders and suspension emails, shall also be binding on you.</p>

<p><strong>26.2 Force Majeure:</strong> We will not be responsible for the delays or damages that may occur due to any act, omission or delay caused by a Force Majeure Event. We will be entitled to discontinue the Services with immediate effect on the occurrence of a Force Majeure Event, if in our opinion we are unable to continue to provide the Services as per these Terms.</p>

<p><strong>26.3 Email Communication:</strong> You agree that any notices, agreements, disclosures, or other communications that we send to you electronically through email will satisfy any legal communication requirements, including that those communications be in writing. You agree to receive such electronic notices from us, which will be sent by email to the email address then associated with your Customer Account. You are responsible for ensuring that the email address associated with your Account is accurate and current. Any email notice that we send to that email address will be effective when sent, whether or not you actually receive the email.</p>

<p><strong>26.4 Relationship of the Parties:</strong> The parties are independent contractors. These Terms does not create a partnership, franchise, joint venture, agency, fiduciary or employment relationship between the parties. Neither party, nor any of their respective affiliates, is an agent of the other for any purpose or has the authority to bind the other.</p>

<p><strong>26.5 Assignment:</strong> You may not assign, transfer or delegate any of your rights and obligations under these Terms, in whole or in part, by operation of law or otherwise, without our prior written consent. We may assign, transfer or delegate our rights and obligations under these Terms without notice or consent.</p>

<p><strong>26.6 No Waiver:</strong> Neither party will be treated as having waived any rights by not exercising (or delaying the exercise of) any rights under this Agreement.</p>

<p><strong>26.7 Severability:</strong> If any part of these Terms is invalid, illegal, or unenforceable, the rest of the Agreement will remain in effect.</p>

<p><strong>26.8 Non-Solicitation:</strong> You for any reason, shall not, directly or indirectly solicit our employees who are on our panel/rolls to leave their respective employment/business engagements during the period you are using the Services and for 2 (two) years after the termination of Services.</p>

<p><strong>26.9 Governing Law:</strong> These Terms shall be governed and constructed in accordance with the Applicable Laws of India. Subject to the Clause 26.10 below, the courts at New Delhi shall have exclusive jurisdiction over any of the disputes arising out of or in relation to these Terms.</p>

<p><strong>26.10 Dispute Resolution:</strong> In the event of any dispute, claim or controversy arising under, or in relation to these Terms, such dispute shall be resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996. The dispute shall be settled by a sole arbitrator to be appointed by the parties to the dispute and the seat of arbitration shall be New Delhi, India. The arbitration award shall be final and binding on the Parties and shall be enforceable in any competent court of law.</p>
`;

console.log('🔄 Appending sections 23-26 to Terms & Conditions...');

db.get('SELECT content FROM integrity_pages WHERE slug = ?', ['terms'], (err, row) => {
    if (err) {
        console.error('❌ Error fetching content:', err.message);
        db.close();
        return;
    }

    if (!row) {
        console.error('❌ No row found with slug "terms"');
        db.close();
        return;
    }

    // Append the new sections to existing content
    const newContent = row.content + additionalSections;

    db.run(
        'UPDATE integrity_pages SET content = ?, updated_at = datetime("now") WHERE slug = ?',
        [newContent, 'terms'],
        function (err) {
            if (err) {
                console.error('❌ Error updating content:', err.message);
            } else {
                console.log('✅ Sections 23-26 added successfully!');
                console.log('   Rows affected: ' + this.changes);

                db.get(
                    'SELECT LENGTH(content) as content_length FROM integrity_pages WHERE slug = ?',
                    ['terms'],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Error verifying:', err.message);
                        } else {
                            console.log('📋 New content length: ' + row.content_length + ' characters');
                        }
                        db.close();
                    }
                );
            }
        }
    );
});
